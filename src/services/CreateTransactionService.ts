// import AppError from '../errors/AppError';
import { getCustomRepository, getRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    // TODO

    // Cria conexão com Category
    const catetoryRepository = getRepository(Category);

    // Busca category da request na tabela de categories
    let categoryFromDB = await catetoryRepository.findOne({
      where: { title: category },
    });

    // Se não achar a category insere no banco
    if (!categoryFromDB) {
      categoryFromDB = catetoryRepository.create({
        title: category,
      });
      await catetoryRepository.save(categoryFromDB);
      console.log(categoryFromDB);
    }

    // Cria conexão com Transaction
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    // Cria nova transaction
    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id: categoryFromDB.id,
    });

    await transactionsRepository.save(transaction);

    console.log(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
