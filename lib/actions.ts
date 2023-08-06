import { ProjectForm } from '@/common.types'
import {
  allProject,
  createProjectMutation,
  createUserMutation,
  deleteProjectMutation,
  getProjectByIdQuery,
  getProjectsOfUserQuery,
  getUserQuery,
  projectsQuery,
  updateProjectMutation
} from '@/graphql'
import { GraphQLClient } from 'graphql-request'
import { json } from 'stream/consumers'

const isProduction = process.env.NODE_ENV === 'production'

const apiUrl = isProduction
  ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || ''
  : 'http://127.0.0.1:4000/graphql'
const apiKey = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || '' : 'letmein'

const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3000'

const client = new GraphQLClient(apiUrl)

const makeGraphQLRequest = async (query: string, variables = {}) => {
  try {
    return await client.request(query, variables)
  } catch (err) {
    throw err
  }
}

export const getUser = (email: string) => {
  client.setHeader('x-api-key', apiKey)
  return makeGraphQLRequest(getUserQuery, { email })
}

export const createUser = (name: string, email: string, avatarUrl: string) => {
  client.setHeader('x-api-key', apiKey)
  const variables = {
    input: { name: name, email: email, avatarUrl: avatarUrl }
  }

  return makeGraphQLRequest(createUserMutation, variables)
}

export const fetchToken = async () => {
  try {
    const response = await fetch(`${serverUrl}/api/auth/token`)
    return response.json()
  } catch (error) {
    throw error
  }
}

export const uploadImage = async (imagePath: string) => {
  try {
    const response = await fetch(`${serverUrl}/api/upload`, {
      method: 'POST',
      body: JSON.stringify({ path: imagePath })
    })

    return response.json()
  } catch (error) {
    throw error
  }
}

export const createNewProject = async (form: ProjectForm, createdId: string, token: string) => {
  const imageUrl = await uploadImage(form.image)

  if (imageUrl.url) {
    // set jwt token
    client.setHeader('Authorization', `Bearer ${token}`)

    const variables = {
      input: {
        ...form,
        image: imageUrl.url,
        createdBy: {
          link: createdId
        }
      }
    }

    return makeGraphQLRequest(createProjectMutation, variables)
  }
}
export const fetchAllProjects = (category?: string, endcursor?: string) => {
  client.setHeader('x-api-key', apiKey)

  if (!category) {
    return makeGraphQLRequest(allProject)
  }

  return makeGraphQLRequest(projectsQuery, { category, endcursor })
}

export const getProjectDetails = (id: string) => {
  client.setHeader('x-api-key', apiKey)
  return makeGraphQLRequest(getProjectByIdQuery, { id })
}

export const getUserProjects = (id: string, last?: number) => {
  client.setHeader('x-api-key', apiKey)
  return makeGraphQLRequest(getProjectsOfUserQuery, { id, last })
}

export const deleteUserProjects = (id: string, token: string) => {
  client.setHeader('Authorization', `Bearer ${token}`)
  return makeGraphQLRequest(deleteProjectMutation, { id })
}

export const updateUserProjects = async (form: ProjectForm, projectId: string, token: string) => {
  function isBase64URL(str: string) {
    const base64URLRegExp = /^[A-Za-z0-9\-_]+$/
    return base64URLRegExp.test(str)
  }

  let updatedForm = { ...form }

  const isUploadingNewImage = isBase64URL(form.image)

  if (isUploadingNewImage) {
    const imageUrl = await uploadImage(form.image)

    if (imageUrl) {
      updatedForm = {
        ...form,
        image: imageUrl
      }
    }
  }

  const variables = {
    id: projectId,
    input: updatedForm
  }

  client.setHeader('Authorization', `Bearer ${token}`)
  return makeGraphQLRequest(updateProjectMutation, variables)
}
