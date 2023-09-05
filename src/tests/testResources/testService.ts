import 'reflect-metadata';

import { injectable } from 'tsyringe';

export class TestService {
	public printMessage() {
		console.log('hello world');
	}

	public returnText() {
		return 'hello world';
	}
}

@injectable()
export class TestController {
	constructor(public testService: TestService) {}

	public returnTextOfService() {
		return this.testService.returnText();
	}
}

function testDecorator(constructor: Function) {
	console.log(constructor);
}
