'use client'

import { FormState, ProjectInterface, SessionInterface } from '@/common.types'
import Image from 'next/image'
import { ChangeEvent, FormEvent, useState } from 'react'
import FormField from './FormField'
import { categoryFilters } from '@/constants'
import CustomMenu from './CustomMenu'
import Button from './Button'
import { createNewProject, fetchToken, updateUserProjects } from '@/lib/actions'
import { useRouter } from 'next/navigation'

type Props = {
  type: string
  session: SessionInterface
  project?: ProjectInterface
}

// const image = null
const ProjectForm = ({ type, session, project }: Props) => {
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState<FormState>({
    title: project?.title || '',
    description: project?.description || '',
    image: project?.image || '',
    liveSiteUrl: project?.liveSiteUrl || '',
    githubUrl: project?.githubUrl || '',
    category: project?.category || ''
  })

  const handleStateChange = (filedName: string, value: string) => {
    setForm((prevState) => ({ ...prevState, [filedName]: value }))
  }

  const handleChangeImage = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.includes('image')) {
      return alert('Please upload an image file')
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onloadend = () => {
      const result = reader.result as string
      handleStateChange('image', result)
    }
  }

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)

    const { token } = await fetchToken()

    try {
      if (type === 'create') {
        // create project
        await createNewProject(form, session?.user?.id, token)
        router.push('/')
      }

      if (type === 'edit') {
        await updateUserProjects(form, project?.id as string, token)

        router.push(`/`)
      }
    } catch (error) {
      alert(`Failed to ${type === 'create' ? 'create' : 'edit'} a project, try again!`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleFormSubmit} className="flexStart form">
      <div className="flexStart form_image-container">
        <label htmlFor="poster" className="flexCenter form_image-label">
          {!form.image && 'Choose a poster for your project'}
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          required={type === 'create'}
          className="form_image-input"
          onChange={handleChangeImage}
        />
        {form.image && (
          <Image
            src={form?.image}
            className="sm:p-10 object-contain z-20"
            alt="Project poster"
            fill
          />
        )}
      </div>

      <FormField
        title="Title"
        state={form.title}
        placeholder="Flexibble"
        setState={(value) => handleStateChange('title', value)}
      />

      <FormField
        title="Description"
        state={form.description}
        placeholder="Showcase and discover remakable developer projects."
        setState={(value) => handleStateChange('description', value)}
      />

      <FormField
        type="url"
        title="Website URL"
        state={form.liveSiteUrl}
        placeholder="http://www.sample.com"
        setState={(value) => handleStateChange('liveSiteUrl', value)}
      />

      <FormField
        type="url"
        title="GitHub URL"
        state={form.githubUrl}
        placeholder="http://www.github.com"
        setState={(value) => handleStateChange('githubUrl', value)}
      />

      <CustomMenu
        title="Category"
        state={form.category}
        filters={categoryFilters}
        setState={(value) => handleStateChange('category', value)}
      />

      <div className="flexStart w-full">
        <Button
          title={
            isSubmitting
              ? `${type === 'create' ? 'Creating' : 'Editing'}`
              : `${type === 'create' ? 'Create' : 'Edit'}`
          }
          type="submit"
          lefeIcon={isSubmitting ? '' : '/plus.svg'}
          isSubmitting={isSubmitting}
        />
      </div>
    </form>
  )
}

export default ProjectForm
