import { EmbedBuilder } from "discord.js"
import { z } from "zod"

const APIEmbedFooterSchema = z
	.object({
		text: z.string(),
		icon_url: z.string().url().optional(),
		proxy_icon_url: z.string().url().optional(),
	})
	.passthrough()

const APIEmbedImageSchema = z
	.object({
		url: z.string().url(),
		proxy_url: z.string().url().optional(),
		height: z.number().optional(),
		width: z.number().optional(),
	})
	.passthrough()

const APIEmbedThumbnailSchema = APIEmbedImageSchema

const APIEmbedVideoSchema = z
	.object({
		url: z.string().url(),
		height: z.number().optional(),
		width: z.number().optional(),
	})
	.passthrough()

const APIEmbedProviderSchema = z
	.object({
		name: z.string().optional(),
		url: z.string().url().optional(),
	})
	.passthrough()

const APIEmbedAuthorSchema = z
	.object({
		name: z.string().optional(),
		url: z.string().url().optional(),
		icon_url: z.string().url().optional(),
		proxy_icon_url: z.string().url().optional(),
	})
	.passthrough()

const APIEmbedFieldSchema = z
	.object({
		name: z.string(),
		value: z.string(),
		inline: z.boolean().optional(),
	})
	.passthrough()

const APIEmbedSchema = z
	.object({
		title: z.string().optional(),
		type: z.string().optional(),
		description: z.string().optional(),
		url: z.string().url().optional(),
		timestamp: z.string().optional(),
		color: z.number().optional(),
		footer: APIEmbedFooterSchema.optional(),
		image: APIEmbedImageSchema.optional(),
		thumbnail: APIEmbedThumbnailSchema.optional(),
		video: APIEmbedVideoSchema.optional(),
		provider: APIEmbedProviderSchema.optional(),
		author: APIEmbedAuthorSchema.optional(),
		fields: z.array(APIEmbedFieldSchema).optional(),
	})
	.passthrough()



const reminderEmbedBuilderPipeline = z.instanceof(EmbedBuilder).transform((embed, ctx) => {
	const result = APIEmbedSchema.safeParse(embed.data)
	if (!result.success) {
		result.error.issues.forEach(ctx.addIssue.bind(ctx))
		return z.NEVER
	}
	return result.data
})

const pageSchema = z
	.object({
		embeds: reminderEmbedBuilderPipeline.array(),
	})
	.passthrough()

export {
	APIEmbedAuthorSchema,
	APIEmbedFieldSchema,
	APIEmbedFooterSchema,
	APIEmbedImageSchema,
	APIEmbedProviderSchema,
	APIEmbedSchema,
	APIEmbedThumbnailSchema,
	APIEmbedVideoSchema,
	pageSchema,
}

