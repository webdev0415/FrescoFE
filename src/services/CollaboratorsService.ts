import { BehaviorSubject, Observable } from 'rxjs';

export interface CollaboratorInterface {
  email: string;
  id: string;
  name: string;
  role: string;
  count: number;
  color: string;
  selected: boolean;
}

export declare type CollaboratorColorAndCount = Record<
  string,
  { color: string; count: number }
>;

class CollaboratorsService {
  private subject: BehaviorSubject<CollaboratorInterface[]>;
  public state: Observable<CollaboratorInterface[]>;
  private value: CollaboratorInterface[] = [];

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  constructor() {
    this.subject = new BehaviorSubject<CollaboratorInterface[]>([]);
    this.state = this.subject.asObservable();
  }

  update(value: CollaboratorInterface[]): void {
    this.value = value;
    this.subject.next(value);
  }

  patch(value: CollaboratorColorAndCount): void {
    this.value = this.value.map(item => {
      if (value.hasOwnProperty(item.id)) {
        return {
          ...item,
          ...value[item.id],
        };
      } else {
        return item;
      }
    });
    this.subject.next(this.value);
  }
}

export const collaboratorsService = new CollaboratorsService();
