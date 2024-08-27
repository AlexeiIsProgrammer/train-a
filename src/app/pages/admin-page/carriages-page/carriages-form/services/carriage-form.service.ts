import { Injectable } from '@angular/core';
import { Carriage } from '@interface/carriage.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CarriageFormService {
    private readonly isEditForm = new BehaviorSubject<boolean>(false);
    private readonly isCreateForm = new BehaviorSubject<boolean>(false);
    private readonly isFormVisible = new BehaviorSubject<boolean>(false);

    private readonly carriageData = new BehaviorSubject<Carriage>({
        code: 'name',
        name: 'name',
        rows: 1,
        leftSeats: 1,
        rightSeats: 1,
    });

    isEditForm$ = this.isEditForm.asObservable();
    isCreateForm$ = this.isCreateForm.asObservable();
    isFormVisible$ = this.isFormVisible.asObservable();
    carriageData$ = this.carriageData.asObservable();

    setEditForm(value: boolean) {
        this.isEditForm.next(value);
        this.updateFormVisibility();
    }

    setCreateForm(value: boolean) {
        this.isCreateForm.next(value);
        this.updateFormVisibility();
    }

    private updateFormVisibility() {
        const isVisible = this.isEditForm.getValue() || this.isCreateForm.getValue();

        this.isFormVisible.next(isVisible);
    }

    updateCarriageData(data: Carriage) {
        this.carriageData.next(data);
    }

    getCode(): string {
        return this.carriageData.getValue().code;
    }

    generateCode(input: string): string {
        return input
            .replace(/[^\p{L}0-9]+/gu, '-')
            .replace(/([0-9])(\p{L})/gu, '$1-$2')
            .replace(/(\p{L})([0-9])/gu, '$1-$2')
            .replace(/^-+|-+$/g, '')
            .replace(/-+/g, '-')
            .toLowerCase();
    }

    closeWindow() {
        this.setEditForm(false);
        this.setCreateForm(false);
    }
}
