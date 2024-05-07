import React from 'react';
import { Helmet } from 'react-helmet-async';
import BackButton from '../../components/BackButton';
import HTMLRendered from '../../components/HTMLRendered';
import { ContainerList, ListItem } from '../../elements/List';
import TotalExpenseBar from '../../components/TotalExpenseBar';
import { ButtonContainer, ButtonAction } from '../../elements/List';
import { LoadMoreButton, CentralButtonContainer } from '../../elements/List';
import { getDateFromUnixTime, compareUnixTimes } from '../../utils/functions';
import { Category, Description, Value, Date } from '../../elements/List';
import { ReactComponent as Delete } from '../../images/delete.svg';
import { SubtitleContainer, Subtitle } from '../../elements/List';
import { ReactComponent as Edit } from '../../images/edit.svg';
import { Header, Headline } from '../../elements/Header';
import { toChileanPesos } from '../../utils/functions';
import { deleteExpense } from '../../service/expense';
import useGetExpense from '../../hooks/useGetExpense';
import { HeaderButton } from '../../elements/Header';
import { Link } from 'react-router-dom';

const ExpenseList = () => {
  const { expenses, loading, isLastExpense, loadExpenseList } = useGetExpense();

  const loadMoreData = () => {
    if (!isLastExpense) loadExpenseList();
  }

  const deleteData = async (expenseId) => {
    try {
      await deleteExpense(expenseId);

    } catch ({ message }) {
      console.error(message);
    }
  }

  return (
    <>
      <Helmet>
        <title>Expense List</title>
      </Helmet>

      <Header>
        <BackButton />
        <Headline>Expense List</Headline>
      </Header>

      <ContainerList>
        {loading ? (
          <SubtitleContainer>
            <Subtitle>Loading expenses...</Subtitle>
          </SubtitleContainer>
        ) : (
          expenses.length > 0 ? (
            <>
              {expenses.map((expense, index, array) => (
                <div key={expense.id}>
                  {compareUnixTimes(expense.date, array[index - 1]?.date) || (
                    <Date>{getDateFromUnixTime(expense.date)}</Date>
                  )}

                  <ListItem>
                    <Category>
                      <HTMLRendered html={expense.category?.icon} />
                      {expense.category.value}
                    </Category>

                    <Description>{expense.description}</Description>
                    <Value>{toChileanPesos(expense.quantity)}</Value>

                    <ButtonContainer>
                      <ButtonAction as={Link} to={`/expense/modify/${expense.id}`}>
                        <Edit />
                      </ButtonAction>

                      <ButtonAction onClick={() => deleteData(expense.id)}>
                        <Delete />
                      </ButtonAction>
                    </ButtonContainer>
                  </ListItem>
                </div>
              ))}

              <CentralButtonContainer>
                <LoadMoreButton onClick={loadMoreData}>
                  Get More Results
                </LoadMoreButton>
              </CentralButtonContainer>
            </>
          ) : (
            <SubtitleContainer>
              <Subtitle>No expenses to show</Subtitle>
              <HeaderButton as={Link} to='/'>Add Expenses</HeaderButton>
            </SubtitleContainer>
          )          
        )}
      </ContainerList>
      
      <TotalExpenseBar />
    </>
  );
}
 
export default ExpenseList;