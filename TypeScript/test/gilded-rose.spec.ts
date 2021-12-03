import { Item, GildedRose } from '@/gilded-rose';

const items = [
  new Item("+5 Dexterity Vest", 10, 20),
  new Item("Aged Brie", 2, 0),
  new Item("Elixir of the Mongoose", 5, 7),
  new Item("Sulfuras, Hand of Ragnaros", 0, 80),
  new Item("Sulfuras, Hand of Ragnaros", -1, 80),
  new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20),
  new Item("Backstage passes to a TAFKAL80ETC concert", 10, 49),
  new Item("Backstage passes to a TAFKAL80ETC concert", 5, 49),
  // TODO: this conjured item does not work properly yet
  new Item("Conjured Mana Cake", 3, 6)
];

const toEqualAssert = (givenItem: Item, expected: number) => {
  const gildedRose = new GildedRose([givenItem]);
  const items = gildedRose.updateQuality();
  const item = items[0];
  
  expect(item.quality).toBe(expected);
};

const toBeGreaterThan = (givenItem: Item, expected: number) => {
  const gildedRose = new GildedRose([givenItem]);
  const items = gildedRose.updateQuality();
  const item = items[0];
  
  expect(item.quality).toBeGreaterThanOrEqual(expected);
};

describe('Gilded Rose', () => {
  it('should decrese quality for a common item', () => {
    toEqualAssert(new Item("+5 Dexterity Vest", 10, 20), 19);
  });

  describe('Sulfuras', () => {
    it('should not decrease quality over time when "sellIn" is zero', () => {
      toEqualAssert(new Item("Sulfuras, Hand of Ragnaros", 0, 80), 80);
    });

    it('should not decrease quality over time when "sellIn" is negative', () => {
      toEqualAssert(new Item("Sulfuras, Hand of Ragnaros", -1, 80), 80);
    });
  });

  describe("when date has passed", () => {
    describe("and when it's not a Aged Brie", () => {
      it("Quality should degrade twice as fast", () => {
        toEqualAssert(new Item("+5 Dexterity Vest", 0, 20), 18);
      });
    });

    describe("and when a Aged Brie", () => {
      it("Quality should increase for Aged Brie", () => {
        toEqualAssert(new Item("Aged Brie", 0, 20), 22);
      });

      it("Quality should increase for Aged Brie", () => {
        toEqualAssert(new Item("Aged Brie", 11, 20), 21);
      });

    });


  })

  describe("regardless of the days", () => {
    it("Quality shouldn't be more than 50", () => {
      const items = [
        new Item("+5 Dexterity Vest", 10, 50),
        new Item("Aged Brie", 2,50),
        new Item("Elixir of the Mongoose", 5,50),
        new Item("Sulfuras, Hand of Ragnaros", 0, 50),
        new Item("Sulfuras, Hand of Ragnaros", -1, 50),
        new Item("Backstage passes to a TAFKAL80ETC concert", 15, 50),
        new Item("Conjured Mana Cake", 3, 50)
      ];
      const gildedRose = new GildedRose(items);

      gildedRose.updateQuality().forEach(item => {
        expect(item.quality).not.toBeGreaterThan(50);
      });
    });
  });

  describe("when the SellIn is equals to 0 ",() => {
    it("the value can not be inferior to zero for '+5 Dexterity Vest'", () => {
      toBeGreaterThan(new Item("+5 Dexterity Vest", 0, 1), 0);
    });

    it("the value can not be inferior to zero for 'Aged Brie'", () => {
      toBeGreaterThan(new Item("Aged Brie", 0, 1), 0);
    });

    it("the value can not be inferior to zero for 'Elixir of the Mongoose'", () => {
      toBeGreaterThan(new Item("Elixir of the Mongoose", 5, 1), 0);
    });

    it("the value can not be inferior to zero for 'Sulfuras, Hand of Ragnaros'", () => {
      toBeGreaterThan(new Item("Sulfuras, Hand of Ragnaros", 0, 1), 0);
    });

    it("the value can not be inferior to zero for 'Sulfuras, Hand of Ragnaros'", () => {
      toBeGreaterThan(new Item("Sulfuras, Hand of Ragnaros", -1, 1), 0);
    });

    it("the value can not be inferior to zero for 'Backstage passes to a TAFKAL80ETC concert'", () => {
      toBeGreaterThan(new Item("Backstage passes to a TAFKAL80ETC concert", 15, 1), 0);
    });

    it("the value can not be inferior to zero for 'Conjured Mana Cake'", () => {
      toBeGreaterThan(new Item("Conjured Mana Cake", 3, 1), 0);
    });
  });

  describe('Backstage passes', () => {
    it('should  increase by 2 quality when 10 days or less', () => {
      toEqualAssert(new Item("Backstage passes to a TAFKAL80ETC concert", 7, 20), 22);
    });
    
    it('should  increase by 1 quality until 10 days or more', () => {
      toEqualAssert(new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20), 21);
    });

    it('should  increase by 3 quality when 5 days or less', () => {
      toEqualAssert(new Item("Backstage passes to a TAFKAL80ETC concert", 4, 20), 23);
    });
    
    it('should drop quality to 0 after concert', () => {
      toEqualAssert(new Item("Backstage passes to a TAFKAL80ETC concert", 0, 20), 0);
    });
  });
});
