import {EntityState} from '@reduxjs/toolkit';

export interface EntityStateWithLastID<T> extends EntityState<T> {
  last_id_number: number; // この値にPrefixを付加して新しいIDを生成する
}
