'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { updateUserName } from '@/lib/actions/user.actions'
import { UserNameSchema } from '@/lib/validator'

export const ProfileForm = () => {
  const router = useRouter()
  const { data: session, update } = useSession()
  const form = useForm<z.infer<typeof UserNameSchema>>({
    resolver: zodResolver(UserNameSchema),
    defaultValues: {
      name: session?.user?.name ?? '',
    },
  })
  const { toast } = useToast()

  async function onSubmit(values: z.infer<typeof UserNameSchema>) {
    const res = await updateUserName(values)
    if (!res.success)
      return toast({
        variant: 'destructive',
        description: res.message,
      })

    const { data, message } = res
    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: data.name,
      },
    }
    await update(newSession)
    toast({
      description: message,
    })
    router.push('/account/manage')
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4 xs:space-y-6'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm xs:text-base font-semibold'>
                Nouveau nom
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='Saisir votre nouveau nom'
                  {...field}
                  className='text-sm xs:text-base'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex flex-col xs:flex-row gap-3 xs:gap-4 pt-2'>
          <Button
            type='submit'
            disabled={form.formState.isSubmitting}
            className='w-full xs:w-auto rounded-full text-sm xs:text-base font-medium'
          >
            {form.formState.isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => window.history.back()}
            className='w-full xs:w-auto rounded-full text-sm xs:text-base'
          >
            Annuler
          </Button>
        </div>
      </form>
    </Form>
  )
}
