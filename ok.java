package hcmute;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class BankTest {
	private static Bank bank;

	@BeforeAll
	static void setBank() {
		bank = new Bank();
	}

	@Nested
	class TestWithOnePerson {

		@BeforeEach
		void setUp() {
			bank.createAccount("Nguyen Thai Van", 1000);
		}

		@Test
		void test_1() {
			Boolean actual = bank.checkAccountExist("Nguyen Thai Van");
			assertTrue(actual);
		}

		@Test
		void test_2() {
			Boolean actual = bank.checkAccountExist("Phan Minh Thuan");
			assertFalse(actual);
		}

		@Test
		void test_3() {
			int actual = bank.getBalanceOfAccount("Nguyen Thai Van");
			int expected = 1000;
			assertEquals(expected, actual);
		}

		@Test
		void test_4() {
			int actual = bank.getBalanceOfAccount("Phan Minh Thuan");
			int expected = Integer.MIN_VALUE;
			assertEquals(expected, actual);
		}

		@Test
		void test_5() {
			Boolean check = bank.withdraw("Nguyen Thai Van", 100);
			int actual = bank.getBalanceOfAccount("Nguyen Thai Van");
			int expected = 900;
			assertAll("heading", () -> assertEquals(expected, actual), () -> assertTrue(check));
		}

		@Test
		void test_6() {
			Boolean check = bank.withdraw("Nguyen Thai Van", -100);
			int actual = bank.getBalanceOfAccount("Nguyen Thai Van");
			int expected = 1000;
			assertAll("heading", () -> assertEquals(expected, actual), () -> assertFalse(check));
		}

		@Test
		void test_7() {
			Boolean check = bank.withdraw("Nguyen Thai Van", 1100);
			int actual = bank.getBalanceOfAccount("Nguyen Thai Van");
			int expected = 1000;
			assertAll("heading", () -> assertEquals(expected, actual), () -> assertFalse(check));
		}

		@Test
		void test_8() {
			Boolean check = bank.withdraw("Phan Minh Thuan", 100);
			assertFalse(check);
		}

		@ParameterizedTest
		@ValueSource(ints = { -100, 100, 200, 0, 1100, 1200 })
		void test_9(int candidate) {
			Boolean check = bank.withdraw("Nguyen Thai Van", candidate);
			if (candidate > 1000 || candidate < 0) {
				assertFalse(check);
			} else {
				int expected = 1000 - candidate;
				int actual = bank.getBalanceOfAccount("Nguyen Thai Van");
				assertEquals(expected, actual);
			}
		}

		@ParameterizedTest
		@ValueSource(ints = { -100, 0, 100, 200 })
		void test_10(int candidate) {
			Boolean check = bank.deposit("Nguyen Thai Van", candidate);
			if (candidate < 0) {
				assertFalse(check);
			} else {
				int expected = 1000 + candidate;
				int actual = bank.getBalanceOfAccount("Nguyen Thai Van");
				assertEquals(expected, actual);
			}
		}

		@AfterEach
		void tearDown() {
			bank.removeAccount("Nguyen Thai Van");
		}
	}
}
