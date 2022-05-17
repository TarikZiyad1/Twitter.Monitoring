import { getLastInsertedItemsCount, incrementCount } from '../../DBLayer/GetLastInsertedItemsCount';

describe('Unit tests for app DBLayer', function () {
    test('verifies Incrementing the counter', async () => {
        const counter = await getLastInsertedItemsCount();
        await incrementCount();
        const counter2 = await getLastInsertedItemsCount();
        expect(counter2).toEqual(counter + 1);
    });
});
