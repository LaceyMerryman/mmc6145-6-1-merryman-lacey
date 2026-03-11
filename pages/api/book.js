import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'

// this handler runs for /api/book with any request method (GET, POST, etc)
export default withIronSessionApiRoute(
  async function handler(req, res) {

    if (!req.session || !req.session.user) {
      return res.status(401).end()
    }

    if (req.method === "POST") {
      try {
        const book = JSON.parse(req.body)

        const result = await db.book.add(req.session.user.id, book)

        if (!result) {
          await req.session.destroy()
          return res.status(401).end()
        }

        return res.status(200).end()

      } catch (err) {
        return res.status(400).json({ error: err.message })
      }
    }

    if (req.method === "DELETE") {
      try {
        const { id } = JSON.parse(req.body)

        const result = await db.book.remove(req.session.user.id, id)

        if (!result) {
          await req.session.destroy()
          return res.status(401).end()
        }

        return res.status(200).end()

      } catch (err) {
        return res.status(400).json({ error: err.message })
      }
    }

    return res.status(404).end()
  },
  sessionOptions
)