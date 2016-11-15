import _ from "lodash"
import is from "simply-is"

// Representation of an array of objects
// [ {}, {}, {}, ... ]
export class Collection{
	constructor(arr, sort_settings={}){
		this._data = _.cloneDeep(arr)
		this.data = _.cloneDeep(arr)
		this.sort_settings = sort_settings
		this.length = this.data.length
		this.handlers = {
			"change": [],
			"sort": [],
			"filter": [],
			"map": [],
			"unique": [],
			"merge": [],
			"reset": []
		}
	}

	// returns an array of the data
	get = () => _.cloneDeep(this.data)
	value = () => this.get()

	// Expects object of key --> sort type mappings
	// e.g. { "a" : "desc", "b": "asc" }
	sort = (sort_settings) => {
		this.sort_settings = _.assign({}, this.sort_settings, sort_settings)
		let sort_columns = [],
			sort_directions = []
		_.forEach( Object.keys( this.sort_settings ) , column => {
			sort_columns.push(column)
			sort_directions.push( this.sort_settings[column] )
		})
		this.data = _.orderBy( this.data, sort_columns, sort_directions )
		return this.emit("change").emit("sort")
	}

	// Expects either:
	//   (1) a function that returns true or false for each element (e.g. x => x.a > 2 )
	//   (2) object of key --> value mappings (e.g. { "a": 1 })
	// https://lodash.com/docs/4.16.4#filter
	filter = (filters) => {
		if( is.array(filters) ){
			filters.forEach( filter => {
				console.log('filtering', filter)
				this.data = _.filter( this.data, filter )
				console.log(this.data)
			})
		}else{
			this.data = _.filter( this.data, filters )
		}
		return this.emit("change").emit("filter")
	}

	// Expects a lambda function to run for every element
	// https://lodash.com/docs/4.16.4#map
	map = (lambda) => {
		this.data = _.map( this.data, lambda )
		return this.emit("change").emit("map")
	}

	// Removes duplicates from the collection
	unique = () => {
		if( is.object(this.data[0]) ){
			this.data = _.uniqWith( this.data, _.isEqual )
		}else{
			this.data = _.uniq(this.data)
		}
		return this.emit("change").emit("unique")
	}

	// Clones this current Collection
	clone = () => {
		return _.cloneDeep(this)
	}

	// Is there an element that matches?
	has = (filters) => {
		return !!_.filter( this.data, filters ).length
	}

	// Resets the data of the collection to match the original
	reset = () => {
		this.data = _.cloneDeep(this._data)
		return this.emit("change").emit("reset")
	}

	// Merges collection data with the provided array based on the values of an ID key/column (used to determine uniqueness of the value)
	merge = ( new_data, id_key ) => {
		let current_values = this.data.map( x => x[id_key] ).sort()
		new_data.forEach( x => {
			let new_val = x[id_key],
				exists = current_values.indexOf(new_val) > 0,
				not_exists = !exists
			if( not_exists ){
				this.data.push( x )
			}else{
				this.data[id_key] = _.assign({}, this.data[id_key], x)
			}
		})
		let sortby = {}
		sortby[id_key] = "asc"
		this.sort(sortby) // will already emit change and sort events
		return this.emit("merge")
	}

	// Aggregates the counts for various values of a particular key. Read-only. Does not mutate the dataset.
	count = (field) => {
		var counter = {}
		this.data.forEach( x => {
			let value = x[field]
			if( counter[value] ){
				counter[value]++
			}else{
				counter[value] = 1
			}
		})
		return counter
	}

	// Adds event handlers
	on = ( event, handler) => {
		if( !this.handlers[event] ){
			this.handlers[event] = []
		}
		this.handlers[event].push(handler)
	}

	// Emit event
	emit = (event) => {
		if( this.handlers[event] ){
			this.handlers[event].forEach( handler => {
				handler(this)
			})
		}else{
			console.error("No handlers for event=" + event + " found on collection.")
		}
		return this
	}
}

export default Collection
