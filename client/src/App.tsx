import React from 'react';
import { RouterX } from '@daniely/routerx';
import { observable } from 'mobx';
import { Observer } from 'mobx-react-lite';
import { api } from './api';

const ROUTES = {
  home: '/',
  company: '/:companyId'
} as const;

export const router = RouterX(ROUTES, 'home', {});
export type RouterType = typeof router;

const ppl = observable.box<string[]>([]);

api.query('getPeople').then((p) => {
  ppl.set(p.map((p) => p.name));
});

export function Main() {
  return (
    <div>
      <Observer>
        {() => {
          return (
            <ul>
              {ppl.get().map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          );
        }}
      </Observer>
    </div>
  );
}
