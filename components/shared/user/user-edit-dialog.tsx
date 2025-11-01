'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, User, Mail, Shield, CheckCircle, XCircle } from 'lucide-react'
import { IUser } from '@/lib/db/models/user.model'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { updateUser } from '@/lib/actions/user.actions'
import { USER_ROLES } from '@/lib/constants'
import { formatId } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface UserEditDialogProps {
  user: IUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function UserEditDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: UserEditDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User' as 'Admin' | 'User',
  })

  // Charger les données de l'utilisateur quand le dialog s'ouvre
  useEffect(() => {
    if (user && open) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: (user.role as 'Admin' | 'User') || 'User',
      })
    }
  }, [user, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    try {
      const result = await updateUser({
        _id: user._id,
        name: formData.name,
        email: formData.email,
        role: formData.role,
      })

      if (result.success) {
        toast({
          title: 'Succès',
          description: result.message || 'Utilisateur mis à jour avec succès',
        })
        onSuccess?.()
        onOpenChange(false)
      } else {
        toast({
          title: 'Erreur',
          description: result.message || 'Impossible de mettre à jour l\'utilisateur',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error
            ? error.message
            : 'Une erreur est survenue lors de la mise à jour',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    return role === 'Admin'
      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[95vw] sm:max-w-lg md:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-0 gap-0 w-full'>
        {!user ? (
          <>
            <DialogHeader className='p-4 sm:p-6'>
              <DialogTitle className='sr-only'>Modifier l&apos;utilisateur</DialogTitle>
              <DialogDescription className='sr-only'>
                Chargement des informations de l&apos;utilisateur
              </DialogDescription>
            </DialogHeader>
            <div className='flex items-center justify-center h-64'>
              <div className='text-sm text-muted-foreground'>
                Utilisateur non trouvé
              </div>
            </div>
          </>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className='relative'
            >
              {/* Header */}
              <DialogHeader className='sticky top-0 z-10 bg-background border-b border-border p-3 sm:p-4 md:p-6'>
                <div className='flex items-start justify-between gap-2 sm:gap-4'>
                  <div className='flex-1 min-w-0 pr-2'>
                    <DialogTitle className='text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 flex items-center gap-2'>
                      <User className='h-4 w-4 sm:h-5 sm:w-5' />
                      <span className='line-clamp-1'>Modifier l&apos;utilisateur</span>
                    </DialogTitle>
                    <DialogDescription className='sr-only'>
                      Formulaire pour modifier les informations de l&apos;utilisateur {user.name || user.email}
                    </DialogDescription>
                      <div className='flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] xs:text-xs sm:text-sm text-muted-foreground'>
                        <span className='font-mono break-all'>{formatId(user._id)}</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onOpenChange(false)}
                      className='flex-shrink-0 p-1.5 sm:p-2 rounded-full hover:bg-muted transition-colors'
                      aria-label='Fermer'
                    >
                      <X className='h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5' />
                    </motion.button>
                  </div>
                </DialogHeader>

                {/* Content */}
                <form onSubmit={handleSubmit}>
                  <div className='p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6'>
                    {/* Informations actuelles */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className='p-3 sm:p-4 rounded-lg bg-muted/50 space-y-2'
                    >
                      <h3 className='text-xs sm:text-sm font-semibold text-muted-foreground'>
                        Informations actuelles
                      </h3>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                        <div className='space-y-1'>
                          <p className='text-[10px] xs:text-xs text-muted-foreground'>
                            Nom actuel
                          </p>
                          <p className='text-xs sm:text-sm font-medium'>
                            {user.name}
                          </p>
                        </div>
                        <div className='space-y-1'>
                          <p className='text-[10px] xs:text-xs text-muted-foreground'>
                            Rôle actuel
                          </p>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-[10px] xs:text-xs font-medium ${getRoleBadgeColor(
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Formulaire de modification */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className='space-y-4 sm:space-y-5'
                    >
                      {/* Nom */}
                      <div className='space-y-2'>
                        <Label htmlFor='name' className='text-xs sm:text-sm font-medium flex items-center gap-2'>
                          <User className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                          Nom complet
                        </Label>
                        <Input
                          id='name'
                          type='text'
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, name: e.target.value }))
                          }
                          placeholder='Entrez le nom complet'
                          className='text-xs sm:text-sm'
                          required
                          disabled={isLoading}
                        />
                      </div>

                      {/* Email */}
                      <div className='space-y-2'>
                        <Label htmlFor='email' className='text-xs sm:text-sm font-medium flex items-center gap-2'>
                          <Mail className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                          Adresse email
                        </Label>
                        <Input
                          id='email'
                          type='email'
                          value={formData.email}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, email: e.target.value }))
                          }
                          placeholder='exemple@email.com'
                          className='text-xs sm:text-sm'
                          required
                          disabled={isLoading}
                        />
                      </div>

                      {/* Rôle */}
                      <div className='space-y-2'>
                        <Label htmlFor='role' className='text-xs sm:text-sm font-medium flex items-center gap-2'>
                          <Shield className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                          Rôle
                        </Label>
                        <Select
                          value={formData.role}
                          onValueChange={(value: 'Admin' | 'User') =>
                            setFormData((prev) => ({ ...prev, role: value }))
                          }
                          disabled={isLoading}
                        >
                          <SelectTrigger id='role' className='text-xs sm:text-sm'>
                            <SelectValue placeholder='Sélectionnez un rôle' />
                          </SelectTrigger>
                          <SelectContent>
                            {USER_ROLES.map((role) => (
                              <SelectItem
                                key={role}
                                value={role}
                                className='text-xs sm:text-sm'
                              >
                                <div className='flex items-center gap-2'>
                                  {role === 'Admin' ? (
                                    <Shield className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600' />
                                  ) : (
                                    <User className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600' />
                                  )}
                                  <span>{role}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className='text-[10px] xs:text-xs text-muted-foreground'>
                          Le rôle détermine les permissions de l&apos;utilisateur dans
                          le système
                        </p>
                      </div>
                    </motion.div>

                    {/* Statut de vérification email */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className='flex items-center justify-between p-3 sm:p-4 rounded-lg bg-muted/50'
                    >
                      <div className='flex items-center gap-2'>
                        {user.emailVerified ? (
                          <CheckCircle className='h-4 w-4 sm:h-5 sm:w-5 text-green-600' />
                        ) : (
                          <XCircle className='h-4 w-4 sm:h-5 sm:w-5 text-yellow-600' />
                        )}
                        <div>
                          <p className='text-xs sm:text-sm font-medium'>
                            Email {user.emailVerified ? 'vérifié' : 'non vérifié'}
                          </p>
                          <p className='text-[10px] xs:text-xs text-muted-foreground'>
                            {user.emailVerified
                              ? 'L\'email de l\'utilisateur a été vérifié'
                              : 'L\'email de l\'utilisateur n\'a pas encore été vérifié'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Footer avec boutons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className='sticky bottom-0 border-t border-border bg-background p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end'
                  >
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => onOpenChange(false)}
                      disabled={isLoading}
                      className='w-full sm:w-auto text-xs sm:text-sm'
                    >
                      Annuler
                    </Button>
                    <Button
                      type='submit'
                      disabled={isLoading}
                      size='lg'
                      className='flex-1 sm:flex-none h-12 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200'
                    >
                      {isLoading ? (
                        <div className='flex items-center gap-2'>
                          <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                          <span>Mise à jour...</span>
                        </div>
                      ) : (
                        <div className='flex items-center gap-2'>
                          <Save className='h-5 w-5' />
                          <span>Enregistrer les modifications</span>
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </motion.div>
            </AnimatePresence>
        )}
      </DialogContent>
    </Dialog>
  )
}

