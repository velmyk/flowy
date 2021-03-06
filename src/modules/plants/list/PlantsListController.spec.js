import PlantsListController from './PlantsListController';

describe('app::plants PlantsListController', () => {
	let sut,
		$state,
		PlantsService,
		$event;

	let plantId,
		plant;

	beforeEach(() => {

		$state = {
			go: jasmine.createSpy('go')
		};

		$event = {
			stopPropagation: jasmine.createSpy('stopPropagation')
		};

		PlantsService = {
			deletePlant: jasmine.createSpy('deletePlant')
		};

		sut = new PlantsListController($state,
									   PlantsService);
	});

	describe('modify plant', () => {
		beforeEach(() => {
			plantId = Math.random();
			sut.modifyPlant(plantId);
		});

		it('should create plant', () => {
			expect($state.go).toHaveBeenCalledWith('^.modify', { plantId: plantId } );
		});
	});

	describe('add new plant', () => {
		beforeEach(() => {
			sut.addNewPlant();
		});

		it('should go to add plant page', () => {
			expect($state.go).toHaveBeenCalledWith('^.create');
		});
	});

	describe('on swipe left', () => {
		beforeEach(() => {
			sut.forDelete = null;
			plant = RandomString();
			sut.onSwipeLeft(plant);
		});

		it('should show delete button on target item', () => {
			expect(sut.forDelete).toEqual(plant);
		});
	});

	describe('on swipe right', () => {
		beforeEach(() => {
			sut.forDelete = RandomString();
			sut.onSwipeRight();
		});

		it('should show delete button on target item', () => {
			expect(sut.forDelete).toEqual(null);
		});
	});

	describe('delete plant', () => {
		beforeEach(() => {
			plant = RandomString();
			sut.deletePlant(plant, $event);
		});

		it('should prevent opening plant', () => {
			expect($event.stopPropagation).toHaveBeenCalled();
		});

		it('should remove plant', () => {
			expect(PlantsService.deletePlant).toHaveBeenCalledWith(plant);
		});

		it('should reload list of plants', () => {
			expect($state.go).toHaveBeenCalledWith('.', null, {reload: true});
		});
	});

	describe('is plant for delete', () => {
		let anotherPlant;

		beforeEach(() => {
			plant = RandomString();
			anotherPlant = RandomString()
			sut.forDelete = plant;
		});

		it('should check if plant marked to be deleted', () => {
			expect(sut.isPlantMarkedToBeDeleted(plant)).toEqual(true);
		});

		it('should check if plant not marked to be deleted', () => {
			expect(sut.isPlantMarkedToBeDeleted(anotherPlant)).toEqual(false);
		});
	});

	describe('is plant need water', () => {
		let now,
			waterTime;

		beforeEach(() => {
			now = new Date().getTime();
		});

		it('should check if plant need water', () => {
			waterTime = now - 1;
			plant = {
				nextNotification: waterTime
			};
			expect(sut.isPlantNeedWater(plant)).toEqual(true);
		});

		it('should check if plant doesn\'t need water', () => {
			waterTime = now + 1;
			plant = {
				nextNotification: waterTime
			};
			expect(sut.isPlantNeedWater(plant)).toEqual(false);
		});
	});
});