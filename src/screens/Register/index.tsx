import React, { useEffect, useState } from 'react';
import { Keyboard, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import uuid from 'react-native-uuid';

import { useAuth } from '../../hooks/auth';

import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { InputForm } from '../../components/Form/InputForm';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelect } from '../CategorySelect';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes,
} from './styles';

type NavigationProps = {
  navigate: (screen: string) => void;
};

interface FormData {
  name: string;
  amount: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  amount: Yup.number()
    .required('O valor é obrigatório')
    .typeError('Informe um valor númerico')
    .positive('O valor não pode ser negativo'),
});

export function Register() {
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const { user } = useAuth();

  const dataKey = `@goFinances:transactions_user:${user.id}`;
  const navigation = useNavigation<NavigationProps>();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  function handleTransactionTypeSelect(type: 'positive' | 'negative') {
    setTransactionType(type);
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }

  async function handleRegister(form: FormData) {
    if (!transactionType) {
      return Alert.alert('Selecione o tipo da transação');
    }

    if (category.key === 'category') {
      return Alert.alert('Selecione a acategoria');
    }

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    };

    try {
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [...currentData, newTransaction];
      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

      reset();
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria',
      });

      navigation.navigate('Dashboard');
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível salvar');
    }
  }

  useEffect(() => {
    // Excluir todos os dados do storage
    // async function removeData() {
    //   await AsyncStorage.removeItem(dataKey);
    // }
    // removeData();

    async function loadData() {
      const data = await AsyncStorage.getItem(dataKey);
    }
    loadData();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>
        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control}
              error={errors.name && errors.name.message}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
            />
            <InputForm
              name="amount"
              control={control}
              error={errors.amount && errors.amount.message}
              placeholder="Preço"
              keyboardType="numeric"
            />
            <TransactionsTypes>
              <TransactionTypeButton
                title="Entrada"
                type="up"
                isActive={transactionType === 'positive'}
                onPress={() => handleTransactionTypeSelect('positive')}
              />
              <TransactionTypeButton
                title="Saída"
                type="down"
                isActive={transactionType === 'negative'}
                onPress={() => handleTransactionTypeSelect('negative')}
              />
            </TransactionsTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>
          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}
