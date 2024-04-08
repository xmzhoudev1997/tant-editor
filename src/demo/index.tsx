// @ts-nocheck


import intl from './translation.json';
window.intl = intl;

import SQLEditor from '../sql-editor-2';
import React from 'react';

export default () => {
  return (
    <SQLEditor
      value={"SELECT \"#user_id\" , sum(\"pay_amount_sum\") as \"pay_amount_sum\" FROM /* 增量数据 */ ( SELECT \"#user_id\" , sum(\"pay_amount\") as FROM ta_dim.datatable WHERE \"$part_event\" = \"payment\" GROUP BY \"#user_id\" UNION ALL /* 现有数据 */ SELECT \"#user_id\",\"pay_amount_sum\" FROM ta_dim.datatable WHERE \"#user_id\" = ${Variable1} ) GROUP BY \"#user_id\""}
    />
  );
}