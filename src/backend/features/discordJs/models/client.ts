import { Client, Collection } from "discord.js";

import { CommandExport } from "../types/types";

class ReadyClient<TReadyStatus extends boolean = true> extends Client<TReadyStatus> {
    commands:Collection<string,CommandExport> = new Collection();
}

export default ReadyClient