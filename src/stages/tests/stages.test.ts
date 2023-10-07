import stages, { configureStages } from "../stages";
import createContainer from "../../createContainer";
import sinon from "sinon";

test("configuration passes", async () => {
  const TEST_STAGES = ["a", "b"];
  const TEST_KEY = "stages";

  await createContainer(configureStages(TEST_KEY, TEST_STAGES));
});

test("runs stage with correct argument", async () => {
  const TEST_STAGES = ["a", "b"];
  const TEST_KEY = "stages";

  const stub = sinon.stub();

  const container = await createContainer(
    configureStages(TEST_KEY, TEST_STAGES),
    stages(TEST_KEY, TEST_STAGES[0], stub),
  );

  expect(stub.calledWith(container)).toBe(true);
});

test("runs stage in correct order", async () => {
  const TEST_STAGES = ["a", "b"];
  const TEST_KEY = "stages";

  const stubA = sinon.stub();
  const stubB = sinon.stub();

  const container = await createContainer(
    configureStages(TEST_KEY, TEST_STAGES),
    stages(TEST_KEY, TEST_STAGES[0], stubA),
    stages(TEST_KEY, TEST_STAGES[1], stubB),
  );

  sinon.assert.callOrder(stubA, stubB);
});
