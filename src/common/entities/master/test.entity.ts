import { 
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn
} from "typeorm";

@Entity()
export class test{
    @PrimaryGeneratedColumn()
    idx: number;

    @Column()
    test_idx:number;

    @Column()
    test_text:string;

    @CreateDateColumn({
        type:'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    public Createtime: Date;
}