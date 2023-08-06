import { UserProfile } from '@/common.types'
import ProfilePage from '@/components/ProfilePage'
import { getUserProjects } from '@/lib/actions'
import React from 'react'

interface Props {
  params: {
    id: string
  }
}

const UserPage = async ({ params }: Props) => {
  const result = (await getUserProjects(params.id, 100)) as { user: UserProfile }

  if (!result?.user) {
    return <div className="no-result-text">User not found</div>
  }

  return <ProfilePage user={result?.user} />
}

export default UserPage
