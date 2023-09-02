;

import { getCommandExports, getEventExports } from "../services/exportService";

describe("name", () => {
	it("should", async () => {
		const r = await getCommandExports();
        expect(r.length).toBeGreaterThan(0)
		console.log(JSON.stringify(r, null, 4));
	});

	it("should", async () => {
        const r = await getEventExports()
        expect(r.length).toBeGreaterThan(0)
        console.log(JSON.stringify(r, null, 4));
    });
});
