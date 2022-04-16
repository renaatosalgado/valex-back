import * as errorTypes from "../utils/errorTypes.js";
import * as employeeRepository from "../repositories/employeeRepository.js";

export async function verifyEmployeeRegister(
    employeeId: number,
    companyId: number
  ) {
    const employee = await employeeRepository.findById(employeeId);
    if (!employee)
      throw errorTypes.notFound("This employee was not found in the database.");
  
    if (employee.companyId !== companyId)
      throw errorTypes.forbidden("This employee is assigned to another company.");
  
    return employee;
  }