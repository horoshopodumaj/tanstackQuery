import { Geist, Geist_Mono } from "next/font/google";
import { getUser, useUsers } from "@/services/endpoints/usersService";
import { IUSer } from "@/services/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const queryClient = useQueryClient();

  const invalidateData = async () => {
    await queryClient.invalidateQueries({queryKey: ['users']})
  }

  const userCompleteMutation = useMutation({
    mutationFn:(userId: number) => getUser(userId),
    onError: () => console.log('error'),
    onSuccess: async () => {
    await queryClient.invalidateQueries({queryKey: ['users']})
    },
  })

  const setUserCompleted = (id: number) => {
    userCompleteMutation.mutate(id)
  }

   const { isPending, error, data } =
    useUsers();

    if (error) return <>Error!</>

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className=" text-xl">Список пользователей</h1>
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          {isPending ? (
            <>Loading...</>
          ): (
            data?.map((user: IUSer)=> (
              <li className="mb-2 cursor-pointer" key={user.id} onClick={()=> setUserCompleted(user.id)}>
                {user?.name || ''}
              </li>
            ))
          )}

        </ol>

        <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        onClick={invalidateData}
        >Invalidate</button>

      </main>
    </div>
  );
}
