const expect = require('chai').expect
import Collection from '../es6/collections'

var mock_array = [{ a: 6, b: 5 }, { a: 2, b: 3 }, { a: 4, b: 1}]

describe('Collections:', () => {
	it('new collection should be an instance of Collection', done => {
		let collection = new Collection(mock_array)
		expect( collection ).to.be.an.instanceof(Collection)
		done()
	})
	describe('construction', done => {
		it('_data and data should not be referencing the original array object', done => {
			let collection = new Collection(mock_array)
			// should not be referencing the same object
			expect( collection._data ).to.not.equal( mock_array )
			expect( collection.data ).to.not.equal( mock_array ) 
			done()
		})
		it('_data and data should have the same contents as the original array object', done => {
			let collection = new Collection(mock_array)
			// contents should be the same
			expect( collection._data ).to.deep.equal( mock_array )
			expect( collection.data ).to.deep.equal( mock_array )
			done()
		})
		it('mutating Collections.data should not affect original array', done => {
			let collection = new Collection(mock_array)
			let new_element = { a: 3, b: 5 }

			expect( collection.data.length ).to.equal( 3 )
			expect( mock_array.length ).to.equal( 3 )

			collection.data.push(new_element)

			expect( collection.data.length ).to.equal( 4 )
			expect( mock_array.length ).to.equal( 3 )
			done()
		})
		it('mutating Collections._data should not affect original array', done => {
			let collection = new Collection(mock_array)
			let new_element = { a: 3, b: 5 }

			expect( collection._data.length ).to.equal( 3 )
			expect( mock_array.length ).to.equal( 3 )

			collection._data.push(new_element)

			expect( collection._data.length ).to.equal( 4 )
			expect( mock_array.length ).to.equal( 3 )
			done()
		})
	})
	describe('Collections.sort:', () => {
		it('should return an instance of Collection', done => {
			let collection = new Collection(mock_array)
			expect( collection.sort({ 'a': 'desc' }) ).to.be.an.instanceof(Collection)
			done()
		})
		describe('should sort the array based off the provided sort settings', () => {
			it('descending', done => {
				let collection = new Collection(mock_array)
				collection.sort({ 'a': 'desc' })
				expect( collection.data ).to.deep.equal([
					{ a: 6, b: 5 }, 
					{ a: 4, b: 1}, 
					{ a: 2, b: 3 }
				])
				expect( collection._data ).to.deep.equal(mock_array)
				done()
			})
			it('ascending', done => {
				let collection = new Collection(mock_array)
				collection.sort({ 'a': 'asc' })
				expect( collection.data ).to.deep.equal([
					{ a: 2, b: 3 }, 
					{ a: 4, b: 1}, 
					{ a: 6, b: 5 }
				])
				done()
			})
			it('alphabetical sort', done => {
				let collection = new Collection([
					{ a: 'Z', b: 'C' }, 
					{ a: 'C', b: 'F' }, 
					{ a: 'H', b: 'A' }
				])
				collection.sort({ 'a': 'asc' })
				expect( collection.data ).to.deep.equal([
					{ a: 'C', b: 'F' }, 
					{ a: 'H', b: 'A' },
					{ a: 'Z', b: 'C' } 
				])
				done()
			})
		})
	})

	describe('Collections.filter', () => {
		it('should return an instance of Collection', done => {
			let collection = new Collection(mock_array)
			expect( collection.filter( x => x.a > 5 ) ).to.be.an.instanceof(Collection)
			done()
		})
		describe('should filter collection array', () => {
			it('filters correctly based off of lambda/filter function', done => {
				let collection = new Collection(mock_array)
				collection.filter( x => x.a > 5 )
				expect( collection.data ).to.deep.equal([{ a: 6, b: 5 }])
				expect( collection._data ).to.deep.equal(mock_array)
				done()
			})
			it('filters correctly based off of filter object', done => {
				let collection = new Collection(mock_array)
				collection.filter({ a: 6 })
				expect( collection.data ).to.deep.equal([{ a: 6, b: 5 }])
				done()
			})
			it('can return more than one match', done => {
				let collection = new Collection([
					{ a: 6, b: 5 }, 
					{ a: 6, b: 3 }, 
					{ a: 4, b: 1}
				])
				collection.filter({ a: 6 })
				expect( collection.data ).to.deep.equal([
					{ a: 6, b: 5 }, 
					{ a: 6, b: 3 }
				])
				done()
			})
			it('can accept an array of filters', done => {
				let collection = new Collection([
					{ a: 6, b: 5 }, 
					{ a: 6, b: 3 }, 
					{ a: 4, b: 1}
				])
				collection.filter([ { a: 6 }, (x => x.b > 4) ])
				expect( collection.data ).to.deep.equal([
					{ a: 6, b: 5 }
				])
				done()
			})
		})
	})

	describe('Collections.map', () => {
		it('should return an instance of Collection', done => {
			let collection = new Collection(mock_array)
			expect( collection.map( x => x.a ) ).to.be.an.instanceof(Collection)
			done()
		})
		describe('should run the mapped function across all elements in collection', () => {
			it('maps with a lambda/filter function', done => {
				let collection = new Collection([{ a: 6, b: 5 }, { a: 2, b: 3 }])
				collection.map( x =>{ 
					x.a = x.a *2 
					return x
				})
				expect( collection.data ).to.deep.equal([{ a: 12, b: 5 }, { a: 4, b: 3 }])
				expect( collection._data ).to.deep.equal([{ a: 6, b: 5 }, { a: 2, b: 3 }])
				done()
			})
			it('maps with a given property name (like "pluck")', done => {
				let collection = new Collection([{ a: 6, b: 5 }, { a: 2, b: 3 }, { a: 6, b: 5 }])
				collection.map('a')
				expect( collection.data ).to.deep.equal([ 6, 2, 6 ])
				expect( collection._data ).to.deep.equal([{ a: 6, b: 5 }, { a: 2, b: 3 }, { a: 6, b: 5 }])
				done()
			})
		})
	})

	describe('Collections.unique', () => {
		it('removes all duplicates', done =>{
			let collection = new Collection([{ a: 6, b: 5 }, { a: 2, b: 3 }, { a: 6, b: 5 }])
			collection.unique()
			expect( collection.data ).to.deep.equal([ { a: 6, b: 5 }, { a: 2, b: 3 } ])
			expect( collection._data ).to.deep.equal([{ a: 6, b: 5 }, { a: 2, b: 3 }, { a: 6, b: 5 }])
			done()
		})
	})

	describe('Collections.value / Collections.get', () => {
		it('sort, filter, and map methods can be chained', done => {
			let collection = new Collection([
				{ a: 6, b: 5 }, 
				{ a: 6, b: 3 }, 
				{ a: 4, b: 1}
			])
			collection
				.filter({ a: 6 })
				.sort({ b: 'asc' })
				.map( x => {
					x.a = x.a * 2
					return x
				})

			expect( collection.data ).to.deep.equal([ { a: 12, b: 3 }, { a: 12, b: 5 } ])
			done()
		})
		it('Collections.get method returns an array, not an instance of Collections', done => {
			let collection = new Collection(mock_array)
			expect(
				collection.get()
			).to.be.an.instanceof(Array)
			expect(
				collection.value()
			).to.be.an.instanceof(Array)
			done()
		})
		it('Collections.get can be chained with sort and filter as well', done => {
			let collection = new Collection([
				{ a: 6, b: 5 }, 
				{ a: 6, b: 3 }, 
				{ a: 4, b: 1}
			])
			
			let final_value = collection
				.filter({ a: 6 })
				.sort({ b: 'asc' })
				.get()
			
			expect( final_value ).to.deep.equal([
				{ a: 6, b: 3 },
				{ a: 6, b: 5 }
			])
			done()
		})
		describe('the value returned from get() is a snapshot of the current state of the collection', () => {
			it('mutating the returned array will not affect the original Collection.data array', done => {
				let collection = new Collection([
					{ a: 6, b: 5 }, 
					{ a: 6, b: 3 }, 
					{ a: 4, b: 1}
				])
				let snapshot = collection.get()
				expect( snapshot ).to.deep.equal( collection.data )
				expect( snapshot ).to.not.equal( collection.data ) // Should not be referencing the same object
				snapshot.push({ a: 5, b: 2 })
				expect( snapshot.length ).to.equal(4)
				expect( collection.data.length ).to.equal(3)
				expect( snapshot ).to.not.deep.equal( collection.data )
				done()
			})
			it('mutating the original Collection.data array will not affect the returned array', done => {
				let collection = new Collection([
					{ a: 6, b: 5 }, 
					{ a: 6, b: 3 }, 
					{ a: 4, b: 1}
				])
				let snapshot = collection.get()
				expect( snapshot ).to.deep.equal( collection.data )
				expect( snapshot ).to.not.equal( collection.data ) // Should not be referencing the same object
				collection.filter({ a: 6 })
				expect( collection.data ).to.deep.equal([
					{ a: 6, b: 5 }, 
					{ a: 6, b: 3 }
				])
				expect( snapshot.length ).to.equal(3)
				expect( collection.data.length ).to.equal(2)
				expect( snapshot ).to.not.deep.equal( collection.data )
				done()
			})
		})
	})

	describe('Collections.merge:', () => {
		it('should add new elements to the array and avoid duplicates', done => {
			let collection = new Collection([
				{ a: 6, b: 5 }, 
				{ a: 6, b: 3 }, 
				{ a: 4, b: 1 }
			])
			let new_data = [{ a: 5, b: 4 }, { a: 7, b: 3 }]
			collection.merge(new_data, 'b')
			expect( collection.data ).to.deep.equal([
				{ a: 4, b: 1 },
				{ a: 6, b: 3 }, 
				{ a: 5, b: 4 },
				{ a: 6, b: 5 }, 
			])
			done()
		})
	})

	describe('Collections.reset:', () => {
		it('should return the collection back to original state', done => {
			let collection = new Collection([
				{ a: 6, b: 5 }, 
				{ a: 6, b: 3 }, 
				{ a: 4, b: 1 }
			])
			collection.filter({ a: 6 })
			expect( collection.data ).to.deep.equal([
				{ a: 6, b: 5 }, 
				{ a: 6, b: 3 }, 
			])
			collection.reset()
			expect( collection.data ).to.deep.equal([
				{ a: 6, b: 5 }, 
				{ a: 6, b: 3 }, 
				{ a: 4, b: 1 }
			])
			done()
		})
	})

	describe('Collections.onChange', () => {

		class Subject {
			constructor(){
				this.data = []
			}
			update_data = (collection) => {
				this.data = collection.get()
			}
		}

		it('adds a callback/function to the onChange handlers', done => {
			let collection = new Collection([
				{ a: 6, b: 5 }, 
				{ a: 6, b: 3 }, 
				{ a: 4, b: 1}
			])
			let subject = new Subject()
			subject.data = collection.get()
			collection.on('change', subject.update_data )
			collection.filter({ a: 6 })
			expect( subject.data ).to.deep.equal( collection.get() )
			done()
		})
	})
})
