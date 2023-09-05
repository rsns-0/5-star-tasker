import 'reflect-metadata';

import { TestController, TestService } from './testResources/testService';

import { container } from 'tsyringe';

describe('reflection', () => {
	it('should fail to successfully resolve service dependency', async () => {
		const controller = container.resolve(TestController);
		const res = controller.returnTextOfService();
		expect(res).toEqual('hello world');
	});
});

describe('Test decorator', () => {
	it('should', () => {
		const res = new TestController(new TestService());
		expect(res).toBeDefined();
	});
});
