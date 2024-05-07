import { firestore, auth } from '../firebase';
import { addDoc, getDocs, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { collection, doc } from 'firebase/firestore';

const expensesReference = collection(firestore, 'expenses');

const createExpense = async ({ description, quantity, category, date }) => {
  try {    
    const expenseData = { description, quantity, category, date }

    expenseData.userUid = auth.currentUser.uid;

    await addDoc(expensesReference, expenseData);

    const response = { status: 1, message: 'Successfully registered expense', data: expenseData }
  
    return Promise.resolve(response);

  } catch (message) {
    const response = { status: 0, message: String(message), data: {} }

    return Promise.reject(response);
  }
}

const readExpense = async () => {
  try {
    const { docs } = await getDocs(expensesReference);

    const expenses = docs.map((expenseDocument) => ({
      id: expenseDocument.id,
      description: expenseDocument.get('description'),
      category: JSON.parse(expenseDocument.get('category')),
      quantity: expenseDocument.get('quantity'),
      userUid: expenseDocument.get('userUid'),
      date: expenseDocument.get('date')
    }));

    const response = { status: 1, message: 'Successfully obtained expenses', data: expenses }

    return Promise.resolve(response);

  } catch (error) {
    const response = { status: 0, message: String(error), data: [] }

    return Promise.reject(response);
  }
}

const updateExpense = async ({ id, description = null, quantity = null, category = null, date = null }) => {
  try {
    const expenseReference = doc(firestore, 'expenses', id);
    const expenseDocument = await getDoc(expenseReference);
    const expenseData = {}

    let message = 'Expense doesn\'t exist'
    let status = 2;

    if (expenseDocument.exists()) {
      if (description !== null) expenseData.description = description;
      if (quantity !== null) expenseData.quantity = quantity;
      if (category !== null) expenseData.category = category;
      if (date !== null) expenseData.date = date;
  
      if (Object.values(expenseData).length > 0) await updateDoc(expenseReference, expenseData);
  
      expenseData.id = expenseDocument.id;
      expenseData.description = description ?? expenseDocument.get('description');
      expenseData.category = JSON.parse(category ?? expenseDocument.get('category'));
      expenseData.quantity = quantity ?? expenseDocument.get('quantity');
      expenseData.date = date ?? expenseDocument.get('date');
      expenseData.userUid = expenseDocument.get('userUid');

      message = 'Successfully updated expense'
      status = 1;
    }

    const response = { status, message, data: expenseData }

    return Promise.resolve(response);

  } catch (error) {
    const response = { status: 0, message: String(error), data: {} }

    return Promise.reject(response);
  }
}

const deleteExpense = async (expenseId) => {
  try {
    const expenseReference = doc(firestore, 'expenses', expenseId);
    const expenseDocument = await getDoc(expenseReference);
    const expenseData = {}

    let message = 'Expense doesn\'t exist';
    let status = 2;

    if (expenseDocument.exists()) {
      await deleteDoc(expenseReference);

      expenseData.id = expenseDocument.id;
      expenseData.description = expenseDocument.get('description');
      expenseData.category = JSON.parse(expenseDocument.get('category'));
      expenseData.quantity = expenseDocument.get('quantity');
      expenseData.userUid = expenseDocument.get('userUid');
      expenseData.date = expenseDocument.get('date');

      message = 'Successfully deleted expense';
      status = 1;
    }

    const response = { status, message, data: expenseData }

    return Promise.resolve(response);

  } catch (error) {
    const response = { status: 0, message: String(error), data: {} }

    return Promise.reject(response);
  }
}

const findExpense = async (expenseId) => {
  try {
    const expenseReference = doc(firestore, 'expenses', expenseId);
    const expenseDocument = await getDoc(expenseReference);
    const expenseData = {}

    let message = 'Expense doesn\'t exist';
    let status = 2;

    if (expenseDocument.exists()) {
      expenseData.id = expenseDocument.id;
      expenseData.description = expenseDocument.get('description');
      expenseData.category = JSON.parse(expenseDocument.get('category'));
      expenseData.quantity = expenseDocument.get('quantity');
      expenseData.userUid = expenseDocument.get('userUid');
      expenseData.date = expenseDocument.get('date');

      message = 'Successfully obtained expense';
      status = 1;
    }

    const response = { status, message, data: expenseData }

    return Promise.resolve(response);
    
  } catch (error) {
    const response = { status: 0, message: String(error), data: {} }

    return Promise.reject(response);
  }
}

const getExpenses = async (expensesDocument) => {
  try {
    const { docs } = expensesDocument;

    const expenses = docs.map((expenseDocument) => ({
      id: expenseDocument.id,
      description: expenseDocument.get('description'),
      category: JSON.parse(expenseDocument.get('category')),
      quantity: expenseDocument.get('quantity'),
      userUid: expenseDocument.get('userUid'),
      date: expenseDocument.get('date')
    }));

    const response = { status: 1, message: 'Successfully obtained expenses', data: expenses }

    return Promise.resolve(response);

  } catch (error) {
    const response = { status: 0, message: String(error), data: [] }

    return Promise.reject(response);
  }
}

export {
  createExpense, readExpense, updateExpense, deleteExpense,
  findExpense, getExpenses, expensesReference
};