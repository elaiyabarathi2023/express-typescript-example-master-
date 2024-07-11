import { Router } from 'express';
import { body, param } from 'express-validator';
import AddressDetailController from '../controllers/AddressDetail.conroller';
import { AddressType, NumberType } from '../model/AddressDetail.model';

class AddressDetailRoutes {
  router = Router();
  addressDetailController = new AddressDetailController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      '/',
      [
        body('userId').isMongoId().withMessage('Invalid user ID'),
        body('firstName').notEmpty().withMessage('First name is required'),
        body('lastName').notEmpty().withMessage('Last name is required'),
        body('addressLine1').notEmpty().withMessage('Address line 1 is required'),
        body('city').notEmpty().withMessage('City is required'),
        body('state').notEmpty().withMessage('State is required'),
        body('postalCode').notEmpty().withMessage('Postal code is required'),
        body('country').notEmpty().withMessage('Country is required'),
        body('isDefault').optional().isBoolean().withMessage('isDefault must be a boolean'),
        body('permanentAddress').optional().isBoolean().withMessage('permanentAddress must be a boolean'),
        body('temporaryAddress').optional().isBoolean().withMessage('temporaryAddress must be a boolean'),
        body('addressType').optional().isIn(Object.values(AddressType)).withMessage('Invalid address type'),
        body('contactNumbers.*.number').optional().isString().withMessage('Contact number must be a string'),
        body('contactNumbers.*.type').optional().isIn(Object.values(NumberType)).withMessage('Invalid number type'),
        body('contactNumbers.*.priority').optional().isNumeric().withMessage('Priority must be a number'),
        body('numberType1').optional().isIn(Object.values(NumberType)).withMessage('Invalid number type 1'),
        body('numberType2').optional().isIn(Object.values(NumberType)).withMessage('Invalid number type 2'),
      ],
      this.addressDetailController.create
    );

    this.router.get('/', this.addressDetailController.findAll);

    this.router.get(
      '/:id',
      [param('id').isMongoId().withMessage('Invalid address detail ID')],
      this.addressDetailController.findOne
    );

    this.router.put(
      '/:id',
      [
        param('id').isMongoId().withMessage('Invalid address detail ID'),
        body('userId').optional().isMongoId().withMessage('Invalid user ID'),
        body('firstName').optional().notEmpty().withMessage('First name is required'),
        body('lastName').optional().notEmpty().withMessage('Last name is required'),
        body('addressLine1').optional().notEmpty().withMessage('Address line 1 is required'),
        body('addressLine2').optional().notEmpty().withMessage('Address line 2 is required'),
        body('city').optional().notEmpty().withMessage('City is required'),
        body('state').optional().notEmpty().withMessage('State is required'),
        body('postalCode').optional().notEmpty().withMessage('Postal code is required'),
        body('country').optional().notEmpty().withMessage('Country is required'),
        body('isDefault').optional().isBoolean().withMessage('isDefault must be a boolean'),
        body('permanentAddress').optional().isBoolean().withMessage('permanentAddress must be a boolean'),
        body('temporaryAddress').optional().isBoolean().withMessage('temporaryAddress must be a boolean'),
        body('addressType').optional().isIn(Object.values(AddressType)).withMessage('Invalid address type'),
        body('contactNumbers').optional().isArray().withMessage('Contact numbers must be an array'),
        body('contactNumbers.*.number').optional().isString().withMessage('Contact number must be a string'),
        body('contactNumbers.*.type').optional().isIn(Object.values(NumberType)).withMessage('Invalid number type'),
        body('contactNumbers.*.priority').optional().isNumeric().withMessage('Priority must be a number'),
        body('numberType1').optional().isIn(Object.values(NumberType)).withMessage('Invalid number type 1'),
        body('numberType2').optional().isIn(Object.values(NumberType)).withMessage('Invalid number type 2'),
      ],
      this.addressDetailController.update
    );

    this.router.delete(
      '/:id',
      [param('id').isMongoId().withMessage('Invalid address detail ID')],
      this.addressDetailController.delete
    );
  }
}

export default new AddressDetailRoutes().router;