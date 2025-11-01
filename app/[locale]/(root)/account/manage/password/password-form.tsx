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
import PasswordInput from '@/components/ui/password-input'
import { toast } from '@/hooks/use-toast'
import { updateUserPassword } from '@/lib/actions/user.actions'
import { Password } from '@/lib/validator'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: Password,
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type PasswordUpdateForm = z.infer<typeof passwordUpdateSchema>

export default function PasswordForm() {
  const t = useTranslations('Account')
  const router = useRouter()
  const form = useForm<PasswordUpdateForm>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: PasswordUpdateForm) => {
    try {
      const result = await updateUserPassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })

      if (result.success) {
        toast({
          title: t('Success'),
          description: result.message || t('Password updated successfully'),
        })
        form.reset()
        router.refresh()
      } else {
        toast({
          title: t('Error'),
          description: result.message || t('Failed to update password'),
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
          name='currentPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Current Password')}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={t('Enter current password')}
                  autoComplete='current-password'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t('Current Password Description')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='newPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('New Password')}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={t('Enter new password')}
                  autoComplete='new-password'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t('Password must contain')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Confirm Password')}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={t('Confirm new password')}
                  autoComplete='new-password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>{t('Update Password')}</Button>
      </form>
    </Form>
  )
}

