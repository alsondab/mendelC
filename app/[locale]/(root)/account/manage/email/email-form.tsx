'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import PasswordInput from '@/components/ui/password-input'
import { toast } from '@/hooks/use-toast'
import { updateUserEmail } from '@/lib/actions/user.actions'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

const emailUpdateSchema = z.object({
  newEmail: z.string().min(1, 'Email is required').email('Email is invalid'),
  password: z.string().min(1, 'Password is required'),
})

type EmailUpdateForm = z.infer<typeof emailUpdateSchema>

interface EmailFormProps {
  currentEmail: string
}

export default function EmailForm({ currentEmail }: EmailFormProps) {
  const t = useTranslations('Account')
  const router = useRouter()
  const form = useForm<EmailUpdateForm>({
    resolver: zodResolver(emailUpdateSchema),
    defaultValues: {
      newEmail: '',
      password: '',
    },
  })

  const onSubmit = async (data: EmailUpdateForm) => {
    try {
      const result = await updateUserEmail({
        newEmail: data.newEmail,
        password: data.password,
      })

      if (result.success) {
        toast({
          title: t('Success'),
          description: result.message || t('Email updated successfully'),
        })
        form.reset()
        router.refresh()
      } else {
        toast({
          title: t('Error'),
          description: result.message || t('Failed to update email'),
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: t('Error'),
        description: t('An unexpected error occurred'),
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='newEmail'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('New Email')}</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder={t('Enter new email address')}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t('Current email')}: {currentEmail}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Password')}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={t('Enter your password to confirm')}
                  autoComplete='current-password'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t('Password confirmation description')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>{t('Update Email')}</Button>
      </form>
    </Form>
  )
}

