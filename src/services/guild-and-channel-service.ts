import { container } from "@sapphire/framework"
import { ChannelService } from "./channelService"
import { GuildService } from "./guildService"

export class GuildAndChannelService {
	constructor(
		public channelService = new ChannelService(),
		public guildService = new GuildService()
	) {}

	getGuildsAndTextBasedChannels() {
		const guilds = this.guildService.getBotGuilds()

		const guildsWithFilteredChannels = guilds.mapValues((guild) => {
			return {
				guild,
				channels: guild.channels.cache.filter((channel) => channel.isTextBased()),
			}
		})
		return guildsWithFilteredChannels
	}

	async updateDb() {
		const guilds = this.guildService.getBotGuilds()

		const channels = guilds.flatMap((guild) => {
			return guild.channels.cache.filter((channel) => channel.isTextBased())
		})

		const guildMemberPromises = guilds.map(async (guild) => {
			return guild.members.fetch()
		})
		const members_ = await Promise.all(guildMemberPromises)
		const members = members_.map((guild) => guild.map((mem) => mem)).flat(1)

		const updatedGuilds = await Promise.all(
			guilds.map((guild) => {
				return container.prisma.discord_guilds.registerGuild(guild)
			})
		)

		const channelsPrismaPromise = channels.map((channel) => {
			return container.prisma.discord_channels.unsafeRegister(channel)
		})

		const usersPrismaPromise = members.map((member) => {
			return container.prisma.discord_user.unsafeRegister(member)
		})

		const [updatedChannels, updatedMembers] = await Promise.all([
			container.prisma.$transaction(channelsPrismaPromise),
			container.prisma.$transaction(usersPrismaPromise),
		])

		container.dbLogger.info(
			`Updated ${updatedChannels.length} channels and ${updatedGuilds.length} guilds and ${updatedMembers.length} members.`
		)

		return {
			updatedMembers,
			updatedChannels,
			updatedGuilds,
		}
	}
}
