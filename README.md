# Collection utilities

Representation of a collection of objects.

# Usage example

```
let people = new Collection([
	{ name: 'john', age: 41 }, 
	{ name: 'amy', age: 30 },
	{ name: 'harry', age: 4 } 
	{ name: 'amy', age: 30 }
])

// Cloning, get unique elements only, filter, and sort
let adults = collection
	.clone()
	.unique()
	.filter( person => person.age > 21 )
	.sort({ name: 'asc' })
```

Mapping is also supported.

```
let ages = people.unique().map( x => x.age ).sort()

// will return [4, 30, 41]
```


Complex filters can be used. 

```
people.filter([(x => x.age > 21), { name: 'amy' }]
```

When adding new data to a collection, it can be helpful to only add/update changes.

```
let new_people = [
	{ name: 'john', age: 41 }
	{ name: 'anthony', age: 23 }
]

people.merge( new_people, 'name' }

```

To return the collection to its original state, when it was first declared, (e.g. to reset filters):

```
people.reset()
```
