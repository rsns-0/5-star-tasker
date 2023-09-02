import "reflect-metadata"

import { TestController } from "./testResources/testService";
import { container } from "tsyringe";

describe("reflection", () => {
    
    it("should successfully resolve service dependency", () => {
        const controller = container.resolve(TestController)
        const res = controller.returnTextOfService()
        expect(res).toEqual('hello world')
        

  });



});