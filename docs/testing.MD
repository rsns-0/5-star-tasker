# How to test

## Vitest API Docs
https://vitest.dev/guide/

## Test flow
1. If a test folder is not already in the feature folder, create one called tests in the same directory.
2. Create a file called (insert name here).test.ts
3. Import necessary testing functions from "vitest" like describe, it, expect, etc.
4. Use describe to group tests, it to define a test, and expect as assertions.
5. Run the tests. Convenience package scripts such as yarn test and yarn test:watch are available. Otherwise use commands from vitest for specifics.


### Using describe
Describe is used to group tests together. It takes two parameters, a string and a function.
The string is the name of the group of tests.
The function is where the tests are written.

```typescript
describe("Example", () => {
    // Tests go here
})
```
    
### Using it
It is used to write a test. It takes two parameters, a string and a function.
The string is the name of the test.
The function is where the test is written.

```typescript
it("Example", () => {
    // Test goes here
})
```

### Using expect
Expect is used to check if a value is equal to another value. It takes one parameter, a value.
The value is the value that is being checked.

```typescript
expect(1).toBe(1)
```

You can also use the .not modifier to check if a value is not equal to another value.

```typescript
expect(1).not.toBe(2)
```
### Example full test

```typescript
import {describe, expect, it} from "vitest"

import { User } from "../models/user"


describe("user.toJson", () => {
	it("should return a string equal to the expected test object", () => {
		const expectedPre = {
			id: 1,
			username: "test",
			role: "admin",
		};
		const expected = JSON.stringify(expectedPre);
		const user = new User(1, "test", "admin");
		const actual = user.toJsonString();
		expect(actual).toEqual(expected);
	});

	it("should return a string object not equal to the test object", () => {
		const testDataPre = {
			id: 2,
			username: "testabc",
			role: "user",
		};
		const testData = JSON.stringify(testDataPre);
		const user = new User(1, "test", "admin");
		const actual = user.toJsonString();
		expect(actual).not.toEqual(testData);
	});
});

```