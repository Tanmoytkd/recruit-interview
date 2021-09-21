const CruzHarrell = require("./data.json");

const KatherineCohen = CruzHarrell.subordinates[0];
const RoxanneSimmons = CruzHarrell.subordinates[3];

// return names of all subordinates of person
const example1 = (person) => {
  return person.subordinates.map((subordinate) => subordinate.name);
};

test("Example 1: return names of all subordinates of person", () => {
  expect(example1(CruzHarrell)).toEqual([
    "Katherine Cohen",
    "Lucy Patton",
    "Moon Terry",
    "Roxanne Simmons",
    "Long Morales",
    "Velazquez Dotson",
    "Terri Cantrell",
    "Janna Patterson",
    "Angelina Walsh",
    "Morin Howard",
  ]);
});

function findPersons(person) {
  let result = [CruzHarrell];

  for (const subordinate of person.subordinates) {
    result = [...result, ...findPersons(subordinate)];
  }

  return result;
}

// return company name from email address
const findCompanyFromEmail = (email) => {
  const domain = email.split('@').pop();
  const company = domain.split('.')[0];

  return company;
};

test("Exercise 1.1: return company name from email address", () => {
  expect(findCompanyFromEmail("katherinecohen@ecraze.com")).toEqual("ecraze");
  expect(findCompanyFromEmail("lucypatton@geekwagon.com")).toEqual("geekwagon");
});

// given a person, return list of companies of her subordinates
const findSubordinateCompanies = (person) => {
  return person.subordinates
      .map((subordinate) => subordinate.email)
      .map((email) => findCompanyFromEmail(email));
};

test("Exercise 1.2: given a person, return list of companies of her subordinates", () => {
  expect(findSubordinateCompanies(CruzHarrell)).toEqual([
    "ecraze",
    "geekwagon",
    "isologix",
    "recognia",
    "rockabye",
    "enersave",
    "letpro",
    "geologix",
    "webiotic",
    "zoarere",
  ]);
  expect(findSubordinateCompanies(KatherineCohen)).toEqual([]);
});

// given a person and gender, return number of subordinates of person of given gender
const example2 = (person, gender) => {
  return person.subordinates.filter(
    (subordinate) => subordinate.gender === gender
  ).length;
};

test("Example 2: given a person and gender, return number of subordinates of person of given gender", () => {
  expect(example2(CruzHarrell, "female")).toEqual(6);
  expect(example2(KatherineCohen, "male")).toEqual(0);
});

// given a person and [minAge, maxAge], return number of subordinates in that age range
const subordinatesWithinAgeRange = (person, [minAge, maxAge]) => {
  return person.subordinates
      .filter((subordinate) => subordinate.age >= minAge && subordinate.age <= maxAge)
      .length;
};

test("Exercise 2.1: given a person and [minAge, maxAge], return number of subordinates in that age range", () => {
  expect(subordinatesWithinAgeRange(CruzHarrell, [21, 49])).toEqual(5);
  expect(subordinatesWithinAgeRange(RoxanneSimmons, [55, 65])).toEqual(1);
});

// given a person, return the names of subordinates who themselves have subordinates
const subordinatesWithSubordinates = (person) => {
  return person.subordinates
      .filter((subordinate) => subordinate.subordinates.length > 0)
      .map((subordinate) => subordinate.name);
};

test("Exercise 2.2: given a person, return the names of subordinates who themselves have subordinates", () => {
  expect(subordinatesWithSubordinates(CruzHarrell)).toEqual([
    "Moon Terry",
    "Roxanne Simmons",
    "Long Morales",
    "Velazquez Dotson",
    "Terri Cantrell",
    "Janna Patterson",
    "Angelina Walsh",
    "Morin Howard",
  ]);
  expect(subordinatesWithSubordinates(RoxanneSimmons)).toEqual(["Pat Bryan"]);
});

// given a person, return total balance of her subordinates
const example3 = (person) => {
  return person.subordinates.reduce(
    (total, subordinate) => total + subordinate.balance,
    0
  );
};

test("Example 3: given a person, return total balance of her subordinates", () => {
  expect(example3(CruzHarrell)).toBeCloseTo(49019.81);
  expect(example3(KatherineCohen)).toEqual(0);
});

// given a person, return average age of her subordinates
const subordinateAverageAge = (person) => {
  let totalAge = person.subordinates.reduce(
      (totalAge, subordinate) => totalAge + subordinate.age, 0
  );

  return totalAge / person.subordinates.length;
};

test("Exercise 3.1: given a person, return average age of her subordinates", () => {
  expect(subordinateAverageAge(CruzHarrell)).toBeCloseTo(50.2);
  expect(subordinateAverageAge(RoxanneSimmons)).toBeCloseTo(59);
});

// given a person, return difference between female and male subordinates
// e.g: if someone has 4 female subordinates and 7 male subordinates, return -3(=4-7)
const subordinateGenderDifference = (person) => {
  return person.subordinates
      .map((subordinate) => subordinate.gender === 'female' ? 1 : -1)
      .reduce((sum, genderVal) => sum + genderVal, 0);
};

test("Exercise 3.2: given a person, return difference between female and male subordinates", () => {
  expect(subordinateGenderDifference(CruzHarrell)).toEqual(2);
  expect(subordinateGenderDifference(RoxanneSimmons)).toEqual(1);
});

// do the same subordinateGenderDifference, but with using only 1 reduce function and nothing else
const exercise32a = (person) => {
  return person.subordinates
      .reduce((sum, subordinate) => sum + ((subordinate.gender === 'female') ? 1 : -1), 0);
};

test("Exercise 3.2a: given a person, return difference between female and male subordinates", () => {
  expect(exercise32a(CruzHarrell)).toEqual(2);
  expect(exercise32a(RoxanneSimmons)).toEqual(1);
});

/*
  for next three exercises,
  you can use if-else and/or for loops,
  but can't use any other functions
*/

// implement map function
const map = (array, func) => {
  const result = [];

  for (const item of array) {
    result.push(func(item));
  }

  return result;
};

test("Exercise 4.1: implement map function", () => {
  const m1 = [Math.random(), Math.random(), Math.random(), Math.random()];
  expect(map(m1, (x) => 2 * x)).toEqual(m1.map((x) => 2 * x));

  const m2 = [CruzHarrell, KatherineCohen, RoxanneSimmons];
  expect(map(m2, (x) => x.age)).toEqual(m2.map((x) => x.age));
});

// implement filter function
const filter = (array, func) => {
  const result = [];

  for (const item of array) {
    if (func(item)) {
      result.push(item);
    }
  }

  return result;
};

test("Exercise 4.2: implement filter function", () => {
  const f1 = [
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
  ];
  expect(filter(f1, (x) => x > 0.5)).toEqual(f1.filter((x) => x > 0.5));

  const f2 = CruzHarrell.subordinates;
  expect(filter(f2, (x) => x.isActive)).toEqual(f2.filter((x) => x.isActive));
});

// implement reduce
const reduce = (array, func, initalValue) => {
  let result = initalValue;
  for (const item of array) {
    result = func(result, item);
  }

  return result;
};

test("Exercise 4.3: implement reduce function", () => {
  const r1 = [Math.random(), Math.random(), Math.random(), Math.random()];
  expect(reduce(r1, (total, x) => total * x, 1)).toEqual(
    r1.reduce((total, x) => total * x, 1)
  );

  const r2 = CruzHarrell.subordinates;
  expect(
    reduce(r2, (total, subordinate) => total + subordinate.balance, 0)
  ).toEqual(r2.reduce((total, subordinate) => total + subordinate.balance, 0));
});

// return total number of people in the dataset
const example5 = () => {
  // a helper function to return number of people under specific person
  const getTotalPeople = (person) =>
    // count person herself
    1 +
    // recursively count total employees of all subordinates of person
    person.subordinates
      .map((subordinate) => getTotalPeople(subordinate))
      // add them together
      .reduce((total, employees) => total + employees, 0);

  // return number of people under the top-most person
  return getTotalPeople(CruzHarrell);
};

test("Example 5: return total number of people in the dataset", () => {
  expect(example5()).toEqual(109);
});

// given a color, return number of people who have that eye color
const exercise51 = (color) => {
  const getTotalPeopleWithEyeColor = (person) =>
      (person.eyeColor === color ? 1 : 0) +
      person.subordinates
          .map((subordinate) => getTotalPeopleWithEyeColor(subordinate))
          .reduce((total, employees) => total + employees, 0);

  return getTotalPeopleWithEyeColor(CruzHarrell);
};

test("Exercise 5.1: given a color, return number of people who have that eye color", () => {
  expect(exercise51("green")).toEqual(11);
});

const distance = (location1, location2) =>
  Math.sqrt(
    (location1.longitude - location2.longitude) *
      (location1.longitude - location2.longitude) +
      (location1.latitude - location2.latitude) *
        (location1.latitude - location2.latitude)
  );

test("distance: given two locations, return the distance between them", () => {
  expect(
    distance({ longitude: 67, latitude: 78 }, { longitude: 74, latitude: 102 })
  ).toEqual(25);
});

// given maxDistance, return number of employees who lives within maxDistance distance of their managers
const exercise52 = (maxDistance) => {
  const getTotalCloseSubordinates = (person) => {
    const closeEmployees = person.subordinates
        .filter((subordinate) => distance(person.location, subordinate.location) <= maxDistance)
        .length;

    return closeEmployees +
        person.subordinates
            .map((subordinate) => getTotalCloseSubordinates(subordinate))
            .reduce((total, employees) => total + employees, 0);
  };

  return getTotalCloseSubordinates(CruzHarrell);
};

test("Exercise 5.2: given maxDistance, return number of employees who lives within maxDistance distance of their managers", () => {
  expect(exercise52(5)).toEqual(25);
  expect(exercise52(10)).toEqual(81);
});

// return first name (not full name) of all person who has the same company as their manager
// hint: findCompanyFromEmail
const exercise53 = () => {
  const getFirstName = (person) => person.name.split(' ')[0];
  const getCompany = (person) => findCompanyFromEmail(person.email);

  const getSubordinatesFromSameCompany = (person) => {
    const sameCompanySubordinates = person.subordinates
        .filter((subordinate) => getCompany(person) === getCompany(subordinate))
        .map((subordinate) => getFirstName(subordinate));

    let otherEmployeesMatchingCriteria = person.subordinates
        .map((subordinate) => getSubordinatesFromSameCompany(subordinate))
        .reduce((allValidEmployees, validEmployees) => [...allValidEmployees, ...validEmployees], []);

    return [...sameCompanySubordinates, ...otherEmployeesMatchingCriteria];
  };

  return getSubordinatesFromSameCompany(CruzHarrell);
};

test("Exercise 5.3: return first name (not full name) of all person who has the same company as their manager", () => {
  expect(exercise53()).toEqual(["Suzanne", "Gregory", "Buchanan"]);
});
