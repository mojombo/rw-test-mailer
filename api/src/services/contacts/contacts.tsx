import React from 'react'

import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import { mailer } from 'src/lib/mailer'
import { ContactUsEmail } from 'src/mail/ContactUs'

export const contacts: QueryResolvers['contacts'] = () => {
  return db.contact.findMany()
}

export const contact: QueryResolvers['contact'] = ({ id }) => {
  return db.contact.findUnique({
    where: { id },
  })
}

export const createContact: MutationResolvers['createContact'] = async ({
  input,
}) => {
  logger.info('Creating contact', { input })
  const contact = await db.contact.create({
    data: input,
  })

  console.log('Sending email')

  await mailer.send(
    // Template component goes here...
    <ContactUsEmail
      name={input.name}
      email={input.email}
      message={input.message}
      when={new Date()}
    />,
    // General options go here...
    {
      to: 'joshgmwalker@gmail.com',
      subject: 'Contact Us',
    },
    // Handler-specific options go here...
    {
      // ...
      subDir: 'contact',
    }
  )

  console.log('Email sent')

  return contact
}

export const updateContact: MutationResolvers['updateContact'] = ({
  id,
  input,
}) => {
  return db.contact.update({
    data: input,
    where: { id },
  })
}

export const deleteContact: MutationResolvers['deleteContact'] = ({ id }) => {
  return db.contact.delete({
    where: { id },
  })
}