// This is an import expenses instructions component for the import page.

import styles from './ImportInstructions.module.css';

export default function ImportInstructions() {
  const exampleCsvText = (
    'Date,Description,Amount,Categories\n'
    + '2025-01-01,CVS,20,Medicine,Health\n'
    + '2025-04-15,Netflix,20.99,Streaming Services,Entertainment\n'
    + '2025-07-10,Panda Express,15.5,Restaurants\n'
    + '2025-10-08,Panda Express Refund,-5,Restaurants\n'
    + '2025-12-01,Rent,1000,Bills,Living Expenses\n'
    + '2025-12-31,Whole Foods,24.01,Groceries'
  );

  return (
    <div className={`ImportInstructions ${styles.ImportInstructions}`}>
      <h2 className={styles.h2}>Instructions</h2>
      <ul className={styles.ul}>
        <li>Include a header row: Date,Description,Amount,Categories</li>
        <li>Do not include any blank rows</li>
        <li>Order the data by date,description,amount,categories with no spaces after commas</li>
        <li>If there is no value for a field, leave it blank but still put in a comma. Ex: 2025-01-01,,1,Groceries. ,description,1,Groceries. 2025-01-01,description,1,</li>
        <li>For date, the format must be YYYY-MM-DD and for single digit months/days it has to start with a 0</li>
        <li>For description, if it includes a comma enclose it in double quotes. Ex: 2025-01-01,"The, Spot",1,Restaurants</li>
        <li>Don't use double quotes within the description. Only use them around the whole description when it contains a comma.</li>
        <li>For amounts, dont include commas. Suggestion: use positive values for expenses you paid and negative values for expenses you received such as a return or refund.</li>
        <li>For multiple categories, separate them with commas. A category name cannot contain a comma.</li>
      </ul>
      <div className={styles.exampleContainer}>
        <span>Example:</span>
        <pre className={styles.pre}>{exampleCsvText}</pre>
      </div>
    </div>
  );
}
