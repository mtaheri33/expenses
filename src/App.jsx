// This is the top level React component.

import CreateExpense from './pages/expenses/create/CreateExpense';
import Expenses from './pages/expenses/Expenses';
import UpdateExpense from './pages/expenses/id/UpdateExpense';
import ImportPage from './pages/import-page/ImportPage';
import Index from './pages/index/Index';
import InvalidPage from './pages/invalid-page/InvalidPage';
import SignUp from './pages/sign-up/SignUp';
import { Routes, Route } from 'react-router';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Index />} />
      <Route path='/sign-up' element={<SignUp />} />
      <Route path='/expenses' element={<Expenses />} />
      <Route path='/expenses/create' element={<CreateExpense />} />
      <Route path='/expenses/:expenseId' element={<UpdateExpense />} />
      <Route path='/import' element={<ImportPage />} />
      <Route path='/*' element={<InvalidPage />} />
    </Routes>
  );
}
