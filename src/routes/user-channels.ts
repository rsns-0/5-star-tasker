import { ApplyOptions } from "@sapphire/decorators"
import { methods, Route, type ApiRequest, type ApiResponse } from "@sapphire/plugin-api"
import { config } from "dotenv"
config()
import z from "zod"

const querySchema = z.object({
	user_id: z.string().min(1).max(100),
})

@ApplyOptions<Route.Options>({
	route: "user-channels",
})
export class UserRoute extends Route {
	public async [methods.GET](_request: ApiRequest, response: ApiResponse) {
		if (_request.headers.authorization !== `Bearer ${process.env.DISCORD_SECRET}`) {
			return response.json({
				status: 401,
				message: "Unauthorized",
			})
		}
		const id = querySchema.parse(_request.query).user_id

		const res =
			await this.container.prisma.discord_guilds.getGuildsAndTextBasedChannelsOfUser(id)

		return response.json(res)
	}
}
