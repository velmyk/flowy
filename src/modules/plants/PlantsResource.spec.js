import PlantsResource from './PlantsResource';

describe('app::plants PlantsResource', () => {
	let sut,
		localStorageService;

	let	plant,
		plants;

	beforeEach(() => {

		localStorageService = {
			set: jasmine.createSpy('set'),
			get: jasmine.createSpy('get')
		};

		sut = new PlantsResource(localStorageService);
	});

	describe('create plant', () => {
		beforeEach(() => {
			plant = {};
			sut.savePlant(plant);
		});

		it('should get current list of existing plants', () => {
			expect(localStorageService.get).toHaveBeenCalledWith('plants');
		});

		it('should store plant', () => {
			expect(localStorageService.set).toHaveBeenCalledWith('plants', jasmine.any(Array));
		});
	});

	describe('get all plants', () => {
		let plants;

		beforeEach(() => {
			plants = {};
			localStorageService.get.and.returnValue(plants);
		});

		it('should load all plants', () => {
			expect(sut.getAllPlants()).toEqual(plants);
		});
	});

	describe('get plant by id', () => {
		beforeEach(() => {
			plant = {
				id: Math.random()
			};
			plants = [plant]
			localStorageService.get.and.returnValue(plants);
		});

		it('should find plant in local storage', () => {
			expect(sut.getPlantById(plant.id)).toEqual(plant);
		});
	});

	describe('delete plant', () => {
		let plantsAfterDeleting;

		beforeEach(() => {
			plant = {
				id: Math.random()
			};
			plants = [{id: 1}, {id: 2}, plant, {id: 3}];
			plantsAfterDeleting = [{id: 1}, {id: 2}, {id: 3}];;
			localStorageService.get.and.returnValue(plants);
			sut.deletePlant(plant);
		});

		it('should get current list of existing plants', () => {
			expect(localStorageService.get).toHaveBeenCalledWith('plants');
		});

		it('should store other plants after deleting', () => {
			expect(localStorageService.set).toHaveBeenCalledWith('plants', plantsAfterDeleting);
		});
	});

	describe('update plant', () => {
		let newPlants;

		beforeEach(() => {
			plant = {id: 2, data: 'newData'};
			plants = [ {id: 1, data: 'a'}, {id: 2, data: 'oldData', anotherData: 'b'}, {id: 3, data: 'c'} ];
			newPlants = [ {id: 1, data: 'a'}, {id: 2, data: 'newData', anotherData: 'b'}, {id: 3, data: 'c'} ]
			spyOn(sut, 'getAllPlants').and.returnValue(plants);
			sut.updatePlant(plant);
		});

		it('should get all plants', () => {
			expect(sut.getAllPlants).toHaveBeenCalled();
		});

		it('should save all plants with updates', () => {
			expect(localStorageService.set).toHaveBeenCalledWith('plants', jasmine.any(Array));
		});
	});

});