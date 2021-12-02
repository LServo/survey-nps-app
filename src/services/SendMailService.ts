import nodemailer, { Transporter } from 'nodemailer'
import handlebars from 'handlebars'
import fs from 'fs'

class SendMailService {
  private client: Transporter
  constructor() {
    //.then() é a forma antiga do async/await, dentro do construtor precisamos utiliza-lo porque não é possível torná-lo async
    nodemailer.createTestAccount().then(account => {
      let transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass
        }
      })

      this.client = transporter
    })
  }

  async execute(to: string, subject: string, variables: object, path: string) {
    
    const templateFileContent = fs.readFileSync(path).toString('utf-8')

    const mailTemplateParse = handlebars.compile(templateFileContent)
    const html = mailTemplateParse(variables)
    
    const message = await this.client.sendMail({
      to,
      subject,
      html,
      from: 'NPS <noreplay@nps.com>'
    })

    console.log('Message sent: %s', message.messageId)
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message))
  }
}

export default new SendMailService() // para já criar a instancia assim que a ação for executada