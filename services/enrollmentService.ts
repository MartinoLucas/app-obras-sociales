import { IEnrollmentRepo } from '@/domain/ports/repositories';
import { isWithinWindow } from '@/domain/policies/enrollmentPolicy';

export class EnrollmentService {
  constructor(private repo: IEnrollmentRepo) {}

  async enroll(proId: string, now = new Date()) {
    if (!isWithinWindow(now, 'enroll')) throw new Error('Inscripción habilitada del 1 al 25.');
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    await this.repo.addEnrollment(proId, y, m);
  }

  async unenroll(proId: string, now = new Date()) {
    if (!isWithinWindow(now, 'unenroll')) throw new Error('Baja habilitada del 1 al 25.');
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    await this.repo.addUnenrollment(proId, y, m);
  }
}
