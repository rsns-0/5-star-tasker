import "reflect-metadata"

import { TestController } from "./testResources/testService";
import { container } from "tsyringe";

describe("reflection", () => {
    
    it.fails("should successfully resolve service dependency", async () => {
      const controller = container.resolve(TestController)
        const res = controller.returnTextOfService()
        expect(res).toEqual('hello world')
        

  });



});