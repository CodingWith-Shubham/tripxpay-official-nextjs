import {
  getDatabase,
  ref,
  query,
  orderByChild,
  limitToFirst,
  startAfter,
  get,
} from "firebase/database";

const db = getDatabase();
const itemsPerPage = 10;
let lastItemKey = null;

// Initial query - first page
const firstPageQuery = query(
  ref(db, "items"),
  orderByChild("createdAt"),
  limitToFirst(itemsPerPage)
);

// Get first page
const snapshot = await get(firstPageQuery);
const items = [];
snapshot.forEach((child) => {
  items.push({
    id: child.key,
    ...child.val(),
  });
});
lastItemKey = items[items.length - 1].createdAt; // Assuming createdAt is used for ordering

// Next page query
const nextPageQuery = query(
  ref(db, "items"),
  orderByChild("createdAt"),
  startAfter(lastItemKey),
  limitToFirst(itemsPerPage)
);
