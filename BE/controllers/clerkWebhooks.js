import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    try {
        // tạo svix với clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        // lấy headers từ request
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        }
        // verify webhook
        await whook.verify(JSON.stringify(req.body), headers);
        // lấy dữ liệu từ body
        const { data, type } = req.body;

        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image: data.image_url,
        }
        //các trường hợp webhook
        switch (type) {
            case "user.created": {
                await User.create(userData);
                break;
            }
            case "user.updated": {
                await User.findByIdAndUpdate(data.id, userData);
                break;
            }
            case "user.deleted": {
                await User.findByIdAndUpdate(data.id);
                break;
            }

            default:
                break;
        }
        res.json({ success: true, message: "Webhook processed successfully" });

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message });
    }
}
export default clerkWebhooks;