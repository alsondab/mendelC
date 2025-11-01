'use server'

import { auth } from '@/auth'
import { connectToDatabase } from '../db'
import Address, { IAddress, IAddressInput } from '../db/models/address.model'
import { AddressInputSchema, AddressUpdateSchema } from '../validator'
import { formatError } from '../utils'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// GET - Récupérer toutes les adresses d'un utilisateur
export async function getUserAddresses() {
  try {
    await connectToDatabase()
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('User not authenticated')
    }

    const addresses = await Address.find({ user: session.user.id }).sort({
      isDefault: -1, // Par défaut en premier
      createdAt: -1,
    })

    return {
      success: true,
      data: JSON.parse(JSON.stringify(addresses)) as IAddress[],
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// GET - Récupérer l'adresse par défaut
export async function getDefaultAddress() {
  try {
    await connectToDatabase()
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('User not authenticated')
    }

    const address = await Address.findOne({
      user: session.user.id,
      isDefault: true,
    })

    return {
      success: true,
      data: address ? (JSON.parse(JSON.stringify(address)) as IAddress) : null,
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// CREATE - Créer une nouvelle adresse
export async function createAddress(data: IAddressInput) {
  try {
    await connectToDatabase()
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('User not authenticated')
    }

    const validatedData = AddressInputSchema.parse({
      ...data,
      isDefault: data.isDefault ?? false,
    })

    // Si cette adresse est définie comme défaut, désactiver les autres
    if (validatedData.isDefault) {
      await Address.updateMany(
        { user: session.user.id },
        { $set: { isDefault: false } }
      )
    }

    // Si c'est la première adresse, la définir comme défaut automatiquement
    const existingAddresses = await Address.countDocuments({
      user: session.user.id,
    })
    if (existingAddresses === 0) {
      validatedData.isDefault = true
    }

    const address = await Address.create({
      ...validatedData,
      user: session.user.id,
    })

    revalidatePath('/account/addresses')
    return {
      success: true,
      message: 'Adresse créée avec succès',
      data: JSON.parse(JSON.stringify(address)) as IAddress,
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// UPDATE - Mettre à jour une adresse
export async function updateAddress(
  data: z.infer<typeof AddressUpdateSchema>
) {
  try {
    await connectToDatabase()
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('User not authenticated')
    }

    // Vérifier que l'adresse appartient à l'utilisateur
    const existingAddress = await Address.findOne({
      _id: data._id,
      user: session.user.id,
    })

    if (!existingAddress) {
      throw new Error('Address not found or access denied')
    }

    const validatedData = AddressInputSchema.partial().parse(data)

    // Si cette adresse est définie comme défaut, désactiver les autres
    if (validatedData.isDefault === true) {
      await Address.updateMany(
        { user: session.user.id, _id: { $ne: data._id } },
        { $set: { isDefault: false } }
      )
    }

    // Mettre à jour l'adresse
    const updatedAddress = await Address.findByIdAndUpdate(
      data._id,
      { $set: validatedData },
      { new: true, runValidators: true }
    )

    revalidatePath('/account/addresses')
    return {
      success: true,
      message: 'Adresse mise à jour avec succès',
      data: JSON.parse(JSON.stringify(updatedAddress)) as IAddress,
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// DELETE - Supprimer une adresse
export async function deleteAddress(addressId: string) {
  try {
    await connectToDatabase()
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('User not authenticated')
    }

    // Vérifier que l'adresse appartient à l'utilisateur
    const address = await Address.findOne({
      _id: addressId,
      user: session.user.id,
    })

    if (!address) {
      throw new Error('Address not found or access denied')
    }

    // Compter les adresses restantes
    const addressCount = await Address.countDocuments({
      user: session.user.id,
    })

    if (addressCount <= 1) {
      throw new Error(
        'Vous ne pouvez pas supprimer votre dernière adresse'
      )
    }

    // Supprimer l'adresse
    await Address.findByIdAndDelete(addressId)

    // Si l'adresse supprimée était la défaut, définir la première disponible comme défaut
    if (address.isDefault) {
      const firstAddress = await Address.findOne({ user: session.user.id })
      if (firstAddress) {
        firstAddress.isDefault = true
        await firstAddress.save()
      }
    }

    revalidatePath('/account/addresses')
    return {
      success: true,
      message: 'Adresse supprimée avec succès',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// SET DEFAULT - Définir une adresse comme défaut
export async function setDefaultAddress(addressId: string) {
  try {
    await connectToDatabase()
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('User not authenticated')
    }

    // Vérifier que l'adresse appartient à l'utilisateur
    const address = await Address.findOne({
      _id: addressId,
      user: session.user.id,
    })

    if (!address) {
      throw new Error('Address not found or access denied')
    }

    // Désactiver toutes les autres adresses
    await Address.updateMany(
      { user: session.user.id },
      { $set: { isDefault: false } }
    )

    // Définir cette adresse comme défaut
    address.isDefault = true
    await address.save()

    revalidatePath('/account/addresses')
    return {
      success: true,
      message: 'Adresse définie par défaut avec succès',
      data: JSON.parse(JSON.stringify(address)) as IAddress,
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

