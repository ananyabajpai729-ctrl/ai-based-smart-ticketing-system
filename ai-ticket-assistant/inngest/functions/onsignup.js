import {inngest} from "../client";
import User from "../../models/user.models.js"
export const onUserSignup = inngest.createFunction(
    {id: "on-user-signup", retries: 2},
    {event: "user/signup"},
    async({event, step})=>{
        try {
            const {email} = event.data
            const user = await step.run("get-user-email", async () => {
                const userObject = await User.findOne({email})
                if(!userObject){
                    throw new NonRetriableError("User no longer exists in our database")
                }
                return userObject
            })

            await step.run("send-welcome-email", async ()=>{
                const subject = `Welcome to the app`
                const message = `Hi,\n\n Thanks for signing up.\nWe are glad to have you!!!`
                await sendMail(user.email, subject, message)
            })

            return {success: true}
        } catch (error) {
            console.error("Error running step", error.message)
            return {success: false}
        }
    }
)