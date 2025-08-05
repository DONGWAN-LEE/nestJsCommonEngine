import { 
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn
} from "typeorm";

@Entity()
export class user_test{
    @PrimaryGeneratedColumn()
    idx: number;

    @Column()
    user_idx:number;

    @Column()
    user_text:string;

    @CreateDateColumn({
        type:'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    public Createtime: Date;
}