import { PaginatedMessageMessageOptionsUnion } from "@sapphire/discord.js-utilities";
import { builtInSapphireDefaultActions } from "../../../utils/builtInSapphireDefaultActions";
import { firstPageEmbeds } from "./firstPageEmbeds";

export const premadePageData: PaginatedMessageMessageOptionsUnion[] = [
	{
		actions: builtInSapphireDefaultActions,
		embeds: firstPageEmbeds,
	},
];
