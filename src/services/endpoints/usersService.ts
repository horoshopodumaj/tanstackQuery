import { useQuery } from '@tanstack/react-query'
import api from '../api'


const getUsers = async () => {
  const response = await api.get(`users/`)
  return response.data
}

const getUser = async (userId: number) => {
  return await api.put(`users/${userId}`)
}

const useUsers= () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
  })
}

export { useUsers, getUsers, getUser }
