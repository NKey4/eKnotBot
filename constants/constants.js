const STATUS = [
  { key: "1", Name: "Новая", oid: "60e80f65e4e96aab27b91859" },
  { key: "2", Name: "В работе", oid: "60e80f65e4e96aab27b9185a" },
  { key: "3", Name: "Исполнена", oid: "60e80f65e4e96aab27b9185b" },
  { key: "4", Name: "Закрыта", oid: "60e80f65e4e96aab27b9185c" },
  { key: "5", Name: "Отказана", oid: "610394d252d6e7081c8d2ddc" },
  { key: "6", Name: "Отменена", oid: "614030e83d7e393568a9229f" },
];
const requestCategoryId = [
  { oid: "60e7f14fe4e96aab27b91855", Name: "Сантехника" },
  { oid: "60e7f175089b28500c814c95", Name: "Электричество" },
  { oid: "60e7f179089b28500c814c99", Name: "Плотницкие работы" },
  { oid: "632be470f9d88e372cabdac4", Name: "Видеонаблюдение" },
  { oid: "63491433d93a244e30669735", Name: "Лифт" },
  { oid: "63980a9444733814b4b68904", Name: "Клининг" },
  { oid: "6349178dd93a244e30669784", Name: "Сдача макулатуры" },
  { oid: "634916d5d93a244e30669772", Name: "Сдача бутылок" },
  { oid: "63491d4bd93a244e3066983e", Name: "ЕРЦ" },
  { oid: "60e7f17d089b28500c814c9d", Name: "Другое" },
];
const requestLocationId = [
  { Name: "Квартира", oid: "60e7ea00e4e96aab27b9184d", predName: "В квартире" },
  { Name: "Подъезд", oid: "60e7ea00e4e96aab27b9184e", predName: "В подъезде" },
  { Name: "Дом", oid: "60e7ea00e4e96aab27b9184f", predName: "В доме" },
  { Name: "Двор", oid: "60e7ea00e4e96aab27b91850", predName: "Во дворе" },
  { Name: "Паркинг", oid: "60e7ea00e4e96aab27b91851", predName: "В паркинге" },
  { Name: "Другое", oid: "60e7ea00e4e96aab27b91852", predName: "В другом" },
];
module.exports = {
  STATUS,
  requestCategoryId,
  requestLocationId,
};
