const users = new Map();
users.set("Riya",{
  count:1,
  age:25
})
const user = users.get("Riya");
user.count++;
console.log(users);
console.log(user);
console.log(users.get("Riya"));

